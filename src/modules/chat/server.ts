import type { RequestHandler }              from 'express';
import type { Server }                      from 'node:http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { createAdapter }                    from '@socket.io/redis-adapter';

import { redisClients } from '../../connections/redis';
import { ChatUser }     from './user/model';
import { ChatUserRepo } from './user/repo';

//FriendshipRepo
//UserRepo

//ChatuserRepo

//ChatgroupUserController
//ChatgroupController
//ChatmessageController   sendMessage, sendPrivateMessage
//ChatroomUserController  joinRoom, rejoinRoom, getUsersInRoom
//ChatroomController
//ChatController          getOnlineFriends, disconnecting

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
  
    const chatuser = ChatUser.create({session_id, username}).getDTO();
    const chatuserRepo = new ChatUserRepo();
    await chatuserRepo.insert(chatuser);

    socket.join(session_id);
  
    // TO DO: no longer appear online for users blocked and friends deleted during that same session (so emit ShowOffline)
    
    socket.on('GetOnlineFriends', async () => {
      await getOnlineFriends({});
    });

    socket.on('GetUsersInRoom', async (room) => {
      await getUsersInRoom({});
    });
  
    socket.on('JoinRoom', async (room: string) => {
      await joinRoom({});
    });
  
    socket.on('RejoinRoom', async (room: string) => {
      await rejoinRoom({});
    });
  
    socket.on('SendMessage', async (text: string) => {
      await sendMessage({});
    });
  
    socket.on('SendPrivateMessage', async (text: string, to: string) => {
      await sendPrivateMessage({});
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
  
      /*for (const room in clonedSocket.rooms) {
        if (room !== session_id) {
          // TO DO: don't send a message to the room, simply show the user as offline
          socket.broadcast.to(room).emit('UserWentOffline', username);
        }
      }

      const friends = await friendship.viewAccepted(id);
      if (friends.length) {
        for (const friend of friends) {
          const onlineFriend = await chatStore.getUserSessionId(friend.username);
          if (!onlineFriend) continue;
          socket.broadcast.to(onlineFriend).emit('FriendWentOffline', username);
        }
      }*/

      const chatuserRepo = new ChatUserRepo();
      await chatuserRepo.delete(username);
      // do we need to delete them???
      // or just change their connected status to false???
    });
  
    socket.on('disconnect', async () => {
      const sockets = await io.in(session_id).fetchSockets();
      const isDisconnected = sockets.length === 0;
      if (isDisconnected) {
        // notify other users
        socket.broadcast.emit("user disconnected", user_id);

        //chatStore.deleteUser(username);
        // or
        /*
        sessionStore.saveSession(session_id, {
          user_id:   socket.user_id,
          username:  socket.username,
          connected: false
        });
        */
      }
    });
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
