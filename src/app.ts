'use strict';

import compression                                  from 'compression';
import connectRedis, { Client }                     from 'connect-redis';
import cookie                                       from 'cookie';
import cookieParser                                 from 'cookie-parser';
import cors                                         from 'cors';
//import csurf                                        from 'csurf';  // no longer needed?
import { Client as ESClient }                       from '@elastic/elasticsearch';
import express, { Request, Response, NextFunction } from 'express';
//import expressPinoLogger                            from 'express-pino-logger';
import expressRateLimit                             from 'express-rate-limit';  // Use https://github.com/animir/node-rate-limiter-flexible instead?
import expressSession, { SessionOptions }           from 'express-session';
import helmet                                       from 'helmet';
//import hpp                                          from 'hpp';
import { createServer }                             from 'http';
import { Redis }                                    from 'ioredis';
import { Pool }                                     from 'mysql2/promise';
import { Server as SocketIOServer, Socket }         from 'socket.io';
import { ExtendedError }                            from 'socket.io/dist/namespace';
import { createAdapter }                            from 'socket.io-redis';

import { sendMessage, sendPrivateMessage, joinRoom, disconnecting, getOnlineFriends, getUsersInRoom, rejoinRoom, IMessage } from './chat';
import { Friendship, User } from './access/mysql';
import { ChatStore }        from './access/redis';
import { chatCleanUp }      from './lib/jobs/chatCleanUp';
import { bulkUp }           from './lib/jobs/searchBulkUp';
import { routesInit }       from './routes';

export function appServer(pool: Pool, esClient: ESClient, redisClients: RedisClients) {
  const app =        express();
  const httpServer = createServer(app);

  if (app.get('env') === 'production') app.set('trust proxy', 1);  // trust first proxy
  
  const RedisStore = connectRedis(expressSession);
  const redisSession = new RedisStore({client: redisClients.sessClient});
  // httpOnly: if true, client-side JS can NOT see the cookie in document.cookie
  // maxAge:   86400000 milliseconds = 1 day
  const options: SessionOptions = {
    cookie: (app.get('env') === 'production')
      ? {httpOnly: true,  maxAge: 86400000, sameSite: true,  secure: true}
      : {httpOnly: false, maxAge: 86400000, sameSite: false, secure: false},
    resave:            true,
    saveUninitialized: true,  // false?
    secret:            process.env.SESSION_SECRET || "secret",
    store:             redisSession,
    unset:             "destroy"
  };
  
  const io = new SocketIOServer<IClientToServerEvents, IServerToClientEvents>(httpServer, {
    cors: {
      allowedHeaders: ["sessionId", "userInfo"],
      credentials:    true,
      methods:        ["GET", "POST"],
      origin:         ["https://nobullshitcooking.com", "http://localhost:3000"]
    },
    pingTimeout: 60000
  });
  const { pubClient, subClient } = redisClients;  //pubClient.duplicate()

  io.adapter(createAdapter({pubClient, subClient}));

  // middleware executed for every incoming socket
  io.use((socket: IUberSocket, next: Next) => {
    const parsedCookie = cookie.parse(socket.request.headers.cookie!);
    const sessionId =    cookieParser.signedCookie(parsedCookie['connect.sid'], process.env.SESSION_SECRET!);

    if ( (!sessionId) || (parsedCookie['connect.sid'] === sessionId) ) return next(new Error('Not authenticated.'));

    redisSession.get(sessionId, (err, session) => {
      if (!session || !session.userInfo || !session.userInfo.id) return next(new Error('Not authenticated.'));
      
      socket.sessionId = sessionId;
      socket.userInfo =  session.userInfo;

      const { username } = session.userInfo;
      const chatStore = new ChatStore(pubClient);
      chatStore.createUser({username, sessionId, socketId: socket.id});
      
      return next();
    });
  });

  io.on('connection', (socket: IUberSocket) => {
    const { id, username } = socket.userInfo!;
    if (!id || !username) return;

    const user =       new User(pool);
    const friendship = new Friendship(pool);
    const chatStore =  new ChatStore(pubClient);

    // TO DO: no longer appear online for users blocked and friends deleted during that same session (so emit ShowOffline)
    socket.on('GetOnlineFriends', async () => {
      await getOnlineFriends({id, username, socket, chatStore, friendship});
    });

    socket.on('GetUsersInRoom', async (room) => {
      await getUsersInRoom({room, socket, chatStore});
    });

    socket.on('SendMessage', async (text: string) => {
      await sendMessage({from: username, text, socket, chatStore});
    });

    socket.on('SendPrivateMessage', async (text: string, to: string) => {
      await sendPrivateMessage({to, from: username, text, socket, chatStore, friendship, user});
    });

    socket.on('JoinRoom', async (room: string) => {
      await joinRoom({room, username, socket, chatStore});
    });

    socket.on('RejoinRoom', async (room: string) => {
      await rejoinRoom({room, username, socket, chatStore});
    });

    socket.on('error', (error: Error) => console.log('error: ', error));

    socket.on('disconnecting', async (reason: string) => {
      //console.log('disconnect reason: ', reason);
      await disconnecting({id, username, socket, chatStore, friendship});
    });

    /*socket.on('disconnect', async (reason: string) => {
      console.log('disconnect reason: ', reason);
      const matchingSockets = await io.in(userId).allSockets();
      const disconnected = matchingSockets.size === 0;
      if (disconnected) {
        socket.broadcast.emit('user disconnected', userId);
        sessionStore.save(sessionId, {userId, username, connected: "false"});
      }
    });*/
  });

  if (app.get('env') !== 'test') chatCleanUp(redisClients.pubClient);

  const session = expressSession(options);                         // move up?

  // middleware
  //app.use(expressPinoLogger());
  app.use(express.json());
  app.use(express.urlencoded({extended: false}));
  app.use(expressRateLimit({max: 100, windowMs: 1 * 60 * 1000}));  // max: 1000?  limit each IP address's requests per minute
  app.use(session);                                                // move up?
  app.use(cors({
    credentials: true,
    origin: (app.get('env') === 'production') ? ['https://nobullshitcooking.com'] : ['http://localhost:8080']
  }));
  //app.options('*', cors());
  app.use(helmet());
  //app.use(hpp());
  //app.use(csurf());
  app.use(compression());
  
  routesInit(app, pool, esClient);

  process.on('unhandledRejection', (reason, promise: Promise<any>) => {
    console.log('Unhandled Rejection at: ', reason);
  });

  // TO DO: change again?
  if (process.env.NODE_ENV === 'production') {
    app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
      res.status(500).json({error: error.message || 'something went wrong'});
    });
  } else {
    app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
      res.status(500).json({error});
    });
  }

  // move this, and create startup conditional
  if (process.env.NODE_ENV === 'development') {
    try {
      setTimeout(() => {
        console.log('Now running bulkUp.');
        bulkUp(esClient, pool);
      }, 40000);  // at the 40 second mark
    } catch(err) {
      console.error(err);
    }
  }

  return httpServer;
}



export type RedisClients = {
  pubClient:  Redis;
  subClient:  Redis;
  sessClient: Client;
  //workerClient: Redis;
}

type Next = (err?: ExtendedError | undefined) => void;

interface IUberSocket extends Socket {
  sessionId?: string;
  userInfo?: {
    id?:       number;
    username?: string;
  }
}

interface IClientToServerEvents {
  // Users
  GetOnlineFriends():                           void;
  GetUsersInRoom(room: string):                 void;
  // Messages
  SendMessage(text: string):                    void;
  SendPrivateMessage(text: string, to: string): void;
  // Rooms
  JoinRoom(room: string):                       void;
  RejoinRoom(room: string):                     void;
  //disconnecting
}

interface IServerToClientEvents {
  // Users
  OnlineFriends(onlineFriends: string[]):              void;
  FriendCameOnline(friend: string):                    void;
  FriendWentOffline(friend: string):                   void;
  // Messages
  Message(message: IMessage):                          void;
  PrivateMessage(message: IMessage):                   void;
  FailedPrivateMessage(feedback: string):              void;
  // Rooms
  UsersInRoom(users: string[], room: string):          void;
  UsersInRoomRefetched(users: string[], room: string): void;
  UserJoinedRoom(user: string):                        void;
  UserLeftRoom(user: string):                          void;
}