'use strict';

import compression                                  from 'compression';
import RedisStore                                   from "connect-redis"
import cors                                         from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import expressRateLimit                             from 'express-rate-limit';  // Use https://github.com/animir/node-rate-limiter-flexible instead?
import expressSession, { Session }                  from 'express-session';
import helmet                                       from 'helmet';
import hpp                                          from 'hpp';
import { createServer, IncomingMessage }            from 'http';
import { Redis }                                    from 'ioredis';
import { Pool }                                     from 'mysql2/promise';
import { Server as SocketIOServer, Socket }         from 'socket.io';
import { createAdapter, RedisAdapter }              from '@socket.io/redis-adapter';
const pino = require('pino-http')();

import { sendMessage, sendPrivateMessage, joinRoom, disconnecting, getOnlineFriends, getUsersInRoom, rejoinRoom, IMessage } from './chat';
import { Friendship, User } from './access/mysql';
import { ChatStore }        from './access/redis';
import { chatCleanUp }      from './lib/jobs/chatCleanUp';
import { routesInit }       from './routes';

export function appServer(pool: Pool, { sessionClient, pubClient, subClient }: RedisClients) {
  const app =        express();
  const httpServer = createServer(app);

  if (app.get('env') === 'production') app.set('trust proxy', 1);  // trust first proxy  // insufficient?

  /*

  Middleware

  */
  
  const redisStore = new RedisStore({client: sessionClient});
  const sessionMiddleware = expressSession({
    cookie: (app.get('env') === 'production') ? {
      httpOnly: true,    // if true, client-side JS can NOT see the cookie in document.cookie
      maxAge: 86400000,  // 86400000 milliseconds = 1 day
      sameSite: true,
      secure: true
    } : {
      httpOnly: false,
      maxAge: 86400000,
      sameSite: false,
      secure: false
    },
    resave:            false,
    saveUninitialized: false,
    secret:            process.env.SESSION_SECRET || "secret",
    store:             redisStore,
    unset:             "destroy"
  });

  app.use(pino);
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  app.use(expressRateLimit({max: 100, windowMs: 1 * 60 * 1000}));  // limit each IP address's requests per minute
  app.use(sessionMiddleware);
  app.use(cors({
    credentials: true,
    origin: (app.get('env') === 'production') ? ['https://nobullshitcooking.com'] : ['http://localhost:3000', 'http://localhost:8080']
  }));
  //app.options('*', cors());  // //
  app.use(helmet());
  app.use(hpp());
  app.use('/search/*', hpp({
    whitelist: [
      'filter',
      'filters.equipmentTypes',
      'filters.ingredientTypes',
      'filters.recipeTypes',
      'filters.methods',
      'filters.cuisines',
      'filters.productTypes',
      'filters.productCategories',
      'sorts',
    ]
  }));
  //app.use(csurf());  // no longer maintained! is csrf protection still necessary? if so, find a different solution
  app.use(compression());

  /*

  Routes

  */

  routesInit(app, pool);
  
  /*

  Socket.IO

  */

  const io = new SocketIOServer<IClientToServerEvents, IServerToClientEvents>(httpServer, {
    cors: {
      allowedHeaders: ["sessionId", "userInfo"],
      credentials:    true,
      methods:        ["GET", "POST"],
      origin:         ["https://nobullshitcooking.com", "http://localhost:3000", "http://localhost:8080"]
    },
    pingTimeout: 60000
  });

  io.adapter(createAdapter(pubClient, subClient));

  //io.engine.use(sessionMiddleware);
  io.use((socket, next) => {
    sessionMiddleware(socket.request as Request, {} as Response, next as NextFunction);
  });

  io.use((socket, next) => {  // middleware executed for every incoming socket
    const sessionId =        socket.request.session.id;
    const { id, username } = socket.request.session.userInfo!;
    if (!sessionId || !id || !username) return next(new Error('Not authenticated.'));

    const chatStore = new ChatStore(pubClient);
    chatStore.createUser({sessionId, username});
    console.log("chatStore.createUser called in middleware");
    return next();
  });

  io.on('connection', (socket: Socket) => {
    const sessionId =        socket.request.session.id;
    const { id, username } = socket.request.session.userInfo!;

    if (!sessionId || !id || !username) return;

    const user =       new User(pool);
    const friendship = new Friendship(pool);
    const chatStore =  new ChatStore(pubClient);

    //chatStore.createUser({sessionId, username});

    socket.join(sessionId);

    /*

    Handlers for our events  // TO DO: no longer appear online for users blocked and friends deleted during that same session (so emit ShowOffline)

    */

    socket.on('GetOnlineFriends',   async () =>                         await getOnlineFriends({id, username, socket, chatStore, friendship}));
    socket.on('GetUsersInRoom',     async (room) =>                     await getUsersInRoom({room, socket, chatStore}));
    socket.on('JoinRoom',           async (room: string) =>             await joinRoom({room, sessionId, username, socket, chatStore}));
    socket.on('RejoinRoom',         async (room: string) =>             await rejoinRoom({room, username, socket, chatStore}));
    socket.on('SendMessage',        async (text: string) =>             await sendMessage({from: username, text, sessionId, socket, chatStore}));
    socket.on('SendPrivateMessage', async (text: string, to: string) => await sendPrivateMessage({to, from: username, text, socket, chatStore, friendship, user}));

    /*

    Handlers for Socket.IO reserved events

    */

    socket.on('error',         (error: Error) => console.log('error: ', error));
    socket.on('disconnecting', async (reason: string) => await disconnecting({sessionId, id, username, socket, chatStore, friendship}));
    /*socket.on('disconnect',    async (reason: string) => {
      const sockets = await io.in(sessionId).fetchSockets();
      if (sockets.length === 0) {  // no more active connections for the given user
        chatStore.deleteUser(username);
      }
    });*/
  });

  if (app.get('env') !== 'test') chatCleanUp(pubClient);

  /*

  Rejections, Errors

  */

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
      console.log(error);
      res.status(500).json({error});
    });
  }

  return {httpServer, io};
}

declare module "http" {
  interface IncomingMessage {
    session: Session & {
      authenticated: boolean;
      staffInfo?: {
        id: number;
        staffname: string;
      };
      userInfo?: {
        id: number;
        username: string;
      };
    }
  }
}

/*declare module "express-session" {
  interface SessionData {
    staffInfo?: {
      id: number;
      staffname: string;
    };
    userInfo?: {
      id: number;
      username: string;
    };
  }
}*/

export type RedisClients = {
  pubClient:     Redis;  // | Cluster;
  subClient:     Redis;  // | Cluster;
  sessionClient: RedisStore; //Client;
  //workerClient:  Redis;
}

//import { ExtendedError } from 'socket.io/dist/namespace';
//type Next = (err?: ExtendedError | undefined) => void;

interface IClientToServerEvents {
  GetOnlineFriends:   () =>                         void;
  GetUsersInRoom:     (room: string) =>             void;
  JoinRoom:           (room: string) =>             void;
  RejoinRoom:         (room: string) =>             void;
  SendMessage:        (text: string) =>             void;
  SendPrivateMessage: (text: string, to: string) => void;
  //disconnecting
}

interface IServerToClientEvents {
  OnlineFriends:        (friends: string[]) =>             void;
  FriendCameOnline:     (friend: string) =>                void;
  FriendWentOffline:    (friend: string) =>                void;
  UsersInRoom:          (users: string[], room: string) => void;
  UsersInRoomRefetched: (users: string[], room: string) => void;
  UserJoinedRoom:       (user: string) =>                  void;
  UserLeftRoom:         (user: string) =>                  void;
  Message:              (message: IMessage) =>             void;
  PrivateMessage:       (message: IMessage) =>             void;
  FailedPrivateMessage: (feedback: string) =>              void;
}
