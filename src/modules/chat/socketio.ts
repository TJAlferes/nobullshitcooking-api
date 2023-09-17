import type { RequestHandler }              from 'express';
import type { Server }                      from 'node:http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { createAdapter }                    from '@socket.io/redis-adapter';

import { redisClients } from '../../connections/redis';

import {
  sendMessage,
  sendPrivateMessage,
  joinRoom,
  disconnecting,
  getOnlineFriends,
  getUsersInRoom,
  rejoinRoom
} from '';
import type { Message Chatmessage
import {
  FriendshipRepo,
  UserRepo,
  ChatMessageRepo,
  ChatRoomRepo,
  ChatRoomUserRepo,
  ChatGroupRepo,
  ChatGroupUserRepo
} from './repos/mysql';

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
  
  io.on('connection', (socket: Socket) => {
    const sessionId =        socket.request.session.id;
    const { user_id, username } = socket.request.session.userInfo!;
  
    if (!sessionId || !id || !username) return;
  
    const userRepo         = new UserRepo();
    const friendshipRepo   = new FriendshipRepo();
    const chatmessageRepo  = new ChatmessageRepo();
    const chatroomRepo     = new ChatroomRepo();
    const chatroomUserRepo = new ChatroomUserRepo();
    // maybe not needed?
    //userService, friendshipService, chatmessageService, chatroomService, chatroomUserService
    // old way
    //const chatStore =  new ChatStore(pubClient);
  
    //chatStore.createUser({sessionId, username});

    socket.join(sessionId);
  
    // Handlers for our events
  
    // TO DO: no longer appear online for
    // users blocked and friends deleted
    // during that same session (so emit ShowOffline)
  
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
  
    // Handlers for Socket.IO reserved events
  
    socket.on('error', (error: Error) => console.log('error: ', error));
  
    socket.on('disconnecting', async (reason: string) => {
      await disconnecting({});
    });
  
    /*socket.on('disconnect', async (reason: string) => {
      const sockets = await io.in(sessionId).fetchSockets();
      if (sockets.length === 0) {  // no more active connections for the given user
        chatStore.deleteUser(username);
      }
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
  MessageSent:          (message: Message) =>              void;
  PrivateMessageSent:   (message: Message) =>              void;
  PrivateMessageFailed: (feedback: string) =>              void;
}

//import { ExtendedError } from 'socket.io/dist/namespace';
//type Next = (err?: ExtendedError | undefined) => void;
