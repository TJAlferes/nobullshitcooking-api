import type { RequestHandler }              from 'express';
import type { Server }                      from 'node:http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { createAdapter }                    from '@socket.io/redis-adapter';

import { redisClients }   from '../../connections/redis';

import { FriendshipRepo } from '../user/friendship/repo';

import { chatmessageController } from './message/controller';
import { chatroomController }    from './room/controller';
import { chatroomUserController } from './room/user/controller';
import { ChatUser }              from './user/model';
import { ChatUserRepo }          from './user/repo';
import { chatController }        from './controller';

export function createSocketIOServer(httpServer: Server, sessionMiddleware: RequestHandler) {
  const io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents>(
    httpServer, 
    {
      cors: {
        allowedHeaders: ["sessionId", "userInfo"],
        credentials:    true,
        methods:        ["GET", "POST"],
        origin:         [
          "https://nobullshitcooking.com",
          "http://localhost:3000",
          "http://localhost:8080"
        ]
      },
      pingTimeout: 60000
    }
  );
  
  const { pubClient, subClient } = redisClients;
  io.adapter(createAdapter(pubClient, subClient));
  
  io.engine.use(sessionMiddleware);
  
  io.on('connection', async (socket: Socket) => {
    const session_id = socket.request.session.id;
    const user_id    = socket.request.session.user_id;
    const username   = socket.request.session.username;

    if (!session_id || !user_id || !username) {
      socket.disconnect(true);
      return;
    }

    const timeout = 60 * 1000;  // 1 minute
  
    const chatuser = ChatUser.create({session_id, username, connected: true}).getDTO();
    const chatuserRepo = new ChatUserRepo();
    await chatuserRepo.insert(chatuser);

    socket.join(session_id);
  
    // TO DO: no longer appear online for users blocked and friends deleted during that same session (so emit ShowOffline)
    
    socket.on('GetOnlineFriends', async () => {
      await chatController(socket).getOnlineFriends({user_id, username});
    });

    socket.on('GetUsersInRoom', async (chatroom_id: string) => {
      await chatroomUserController(socket).getUsersInRoom(chatroom_id);
    });
  
    socket.on('JoinRoom', async (params: any) => {
      await chatroomUserController(socket).join(params);
    });
  
    socket.on('RejoinRoom', async (params: any) => {
      await chatroomUserController(socket).rejoin(params);
    });
  
    socket.on('SendMessage', async (params: any) => {
      await chatmessageController(socket).sendMessage(params);
    });
  
    socket.on('SendPrivateMessage', async (params: any) => {
      await chatmessageController(socket).sendPrivateMessage(params);
    });

    async function updateLastActive() {
      if (!username) return;
      const chatuser = await chatuserRepo.getByUsername(username);
      chatuser.last_active = Date.now();
      await chatuserRepo.update(chatuser);
    }

    socket.on('ping', async () => {
      await updateLastActive();
      socket.emit('pong');
    });

    async function checkInactiveClients() {  // TO DO: test this
      if (!username) return;

      const chatuser = await chatuserRepo.getByUsername(username);

      if (Date.now() - Number(chatuser.last_active) > timeout) {
        //const sockets = await io.in(chatuser.session_id).fetchSockets();
        //for (const socket of sockets) {
        //  socket.disconnect(true);
        //}
        io.in(chatuser.session_id).disconnectSockets();

        await chatuserRepo.delete(username);
      }
    }

    setInterval(checkInactiveClients, timeout);
  
    // Handlers for Socket.IO reserved events
  
    socket.on('error', (error: Error) => console.log('error: ', error));
  
    socket.on('disconnecting', async (reason: string) => {
      const rooms = new Set(socket.rooms);
      const chatuserRepo = new ChatUserRepo();
  
      // This works fine for chatrooms and friends, but what about chatgroups and non-friend private conversations???

      for (const room in rooms) {
        if (room === session_id) continue;
        socket.broadcast.to(room).emit('UserWentOffline', username);  // TO DO: don't send a message to the room, simply show the user as offline
      }

      const friendshipRepo = new FriendshipRepo();
      const friends = await friendshipRepo.viewAllOfStatus({user_id, status: "accepted"});
      if (friends.length) {
        for (const friend of friends) {
          const onlineFriend = await chatuserRepo.getByUsername(friend.username);
          if (!onlineFriend) continue;
          socket.broadcast.to(onlineFriend.session_id).emit('FriendWentOffline', username);  // TO DO: don't send a message to the room, simply show the user as offline
        }
      }
      
      await chatuserRepo.delete(username);  // or chatuserRepo.update({session_id, user_id, username, connected: false});
    });
  
    /*socket.on('disconnect', async (reason: string) => {
      const sockets = await io.in(session_id).fetchSockets();
      if (sockets.length > 0) return;
      const chatuserRepo = new ChatUserRepo();
      await chatuserRepo.delete(username);  // or chatuserRepo.update({session_id, user_id, username, connected: false});
    });*/
  });

  return io;
}

interface ClientToServerEvents {
  GetOnlineFriends:   () =>                         void;
  GetUsersInRoom:     (room: string) =>             void;
  JoinRoom:           (room: string) =>             void;
  RejoinRoom:         (room: string) =>             void;
  SendMessage:        (text: string) =>             void;
  SendPrivateMessage: (text: string, to: string) => void;
  //disconnecting
}

interface ServerToClientEvents {
  OnlineFriends:        (friends: string[]) =>             void;
  FriendCameOnline:     (friend: string) =>                void;
  FriendWentOffline:    (friend: string) =>                void;
  UsersInRoom:          (users: string[], room: string) => void;
  UsersInRoomRefetched: (users: string[], room: string) => void;
  UserJoinedRoom:       (user: string) =>                  void;
  UserLeftRoom:         (user: string) =>                  void;
  MessageSent:          (message: Chatmessage) =>          void;
  PrivateMessageSent:   (message: Chatmessage) =>          void;
  PrivateMessageFailed: (feedback: string) =>              void;
}

//import { ExtendedError } from 'socket.io/dist/namespace';
//type Next = (err?: ExtendedError | undefined) => void;
