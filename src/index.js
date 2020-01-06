'use strict';

//require('babel-polyfill');  // pollutes globals?
//require('core-js/stable');  // 'core-js'
require('regenerator-runtime/runtime');
require('dotenv').config();

const express = require('express');
const expressRateLimit = require('express-rate-limit');
//const expressPinoLogger = require('express-pino-logger');
const expressSanitizer = require('express-sanitizer');  // Use something else? This is popular, yet is based on abandonware...
const cors = require('cors');
const helmet = require('helmet');
//const hpp = require('hpp');
//const csurf = require('csurf');  // no longer needed?
const compression = require('compression');

const expressSession = require("express-session");
const connectRedis = require('connect-redis');

const http = require('http');
const socketIO = require('socket.io');
const redisAdapter = require('socket.io-redis');
const cookie = require('cookie');
const cookieParser = require('cookie-parser');

//const { buildSchema } = require('graphql');
//const expressGraphQL = require('express-graphql');

const {
  equipmentRoutes,
  equipmentTypeRoutes,
  ingredientRoutes,
  ingredientTypeRoutes,
  recipeRoutes,
  recipeTypeRoutes,
  cuisineRoutes,
  methodRoutes,
  measurementRoutes,
  favoriteRecipeRoutes,
  staffRoutes,
  userRoutes,
  searchRoutes
} = require('./routes');
const socketConnection = require('./chat');
const cleanUp = require('./chat/workers');
const MessengerUser = require('./redis-access/MessengerUser');  // move
const {
  pubClient,
  subClient,
  sessClient,
  workerClient
} = require('./lib/connections/redisConnection');
//const bulkUp = require('./search');



/*##############################################################################
1. setup
##############################################################################*/

// Note to self: Move a lot of this to a separate init module; export app so you can do integration testing easily.

// app
const app = express();
const rateLimiterOptions = {windowMs: 1 * 60 * 1000, max: 1000};  // limit each IP to 1000 requests per minute (100?)
const corsOptions = {origin: ['http://localhost:8080'], credentials: true};


// chat    // move
const server = http.Server(app);
const io = socketIO(server, {pingTimeout: 60000});

const socketAuth = (socket, next) => {
  const parsedCookie = cookie.parse(socket.request.headers.cookie);
  const sid = cookieParser.signedCookie(
    parsedCookie['connect.sid'],
    process.env.SESSION_SECRET
  );
  const socketid = socket.id;

  if (parsedCookie['connect.sid'] === sid) {
    return next(new Error('Not authenticated.'));
  }

  redisSession.get(sid, function(err, session) {
    if (session.userInfo.userId) {
      socket.request.userInfo = session.userInfo;
      socket.request.sid = sid;
      const messengerUser = new MessengerUser(pubClient);
      messengerUser.addUser(
        session.userInfo.userId,
        session.userInfo.username,
        session.userInfo.avatar,
        sid,
        socketid
      );
      return next();
    } else {
      return next(new Error('Not authenticated.'));
    }
  });
};


// session
const RedisStore = connectRedis(expressSession);
const redisSession = new RedisStore({client: sessClient});
const sessionOptions = {
  store: redisSession,
  name: "connect.sid",
  secret: process.env.SESSION_SECRET || "secret",
  resave: true,
  saveUninitialized: true,
  unset: "destroy"
};
const session = expressSession(sessionOptions);


// prod
if (app.get('env') === 'production') {

  app.set('trust proxy', 1);  // trust first proxy

  // new Chrome requirements:
  /*sessionOptions.cookie = {
    sameSite: none,
    secure: true
  };*/

  /*sessionOptions.cookie = {
    sameSite: true,
    maxAge: 86400000,
    httpOnly: true,
    secure: true
  };*/

  corsOptions.origin = ['https://nobullshitcooking.com'];

} else if (app.get('env') === 'development') {

  sessionOptions.cookie = {
    sameSite: false,
    maxAge: 86400000,
    httpOnly: false,
    secure: false
  };

}



/*##############################################################################
2. middleware
##############################################################################*/

//app.use(expressPinoLogger());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(expressRateLimit(rateLimiterOptions));
app.use(session);
app.use(cors(corsOptions));
//app.options('*', cors());
app.use(helmet());
//app.use(hpp());
app.use(expressSanitizer());
//app.use(csurf());
app.use(compression());

// move these
io.adapter(redisAdapter({pubClient, subClient}));
io.use(socketAuth);
io.on('connection', socketConnection);

const INTERVAL = 60 * 60 * 1000 * 3;  // 3 hours
setInterval(cleanUp, INTERVAL);
// move this, and create startup conditional
/*try {
  setTimeout(() => {
    console.log('Now running bulkUp.');
    bulkUp();
  }, 60000);  // at the 1 minute mark
} catch(err) {
  console.log(err);
}*/



/*##############################################################################
3. routes
##############################################################################*/

app.get('/', (req, res) => {
  try {
    res.send(`No Bullshit Cooking Backend API.`);
  } catch(err) {
    console.log(err);
  }
});
app.use('/equipment', equipmentRoutes);
app.use('/equipment-type', equipmentTypeRoutes);
app.use('/ingredient', ingredientRoutes);
app.use('/ingredient-type', ingredientTypeRoutes);
app.use('/recipe', recipeRoutes);
app.use('/recipe-type', recipeTypeRoutes);
app.use('/cuisine', cuisineRoutes);
app.use('/method', methodRoutes);
app.use('/measurement', measurementRoutes);
app.use('/favorite-recipe', favoriteRecipeRoutes);
app.use('/staff', staffRoutes);
app.use('/user', userRoutes);
app.use('/search', searchRoutes);
//app.use('/graphql', expressGraphQL({schema, rootValue, graphiql: true}));



/*##############################################################################
4. errors
##############################################################################*/

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', reason.stack || reason);
});

if (app.get('env') === 'development') {
  app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({error});
  });
} else {
  app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({error: error.message});  // ???
  });
}



/*##############################################################################
5. listen
##############################################################################*/

let PORT;

if (app.get('env') === 'production') {
  PORT = process.env.PORT || 8081;
  server.listen(PORT, '127.0.0.1', () => console.log('Listening on port ' + PORT));
} else {
  PORT = process.env.PORT || 3003;
  server.listen(PORT, '0.0.0.0', () => console.log('Listening on port ' + PORT));
}
