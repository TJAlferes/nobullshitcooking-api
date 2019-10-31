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

//const expressSession = require("express-session");
//const connectRedis = require('connect-redis');

//const http = require('http');
//const socketIO = require('socket.io');
//const redisAdapter = require('socket.io-redis');
//const cookie = require('cookie');
//const cookieParser = require('cookie-parser');

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
/*
const socketConnection = require('./chat');
const cleanUp = require('./chat/workers');
const MessengerUser = require('./redis-access/MessengerUser');  // move
*/
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
//const server = http.Server(app);
//const io = socketIO(server);

/*
Note to self:
Do NOT use Cluster for PubSub, instead, see on youtube:
Redis Labs | Scaling Redis PubSub with Shahar Mor
/watch?v=6G22a5Iooqk
Though what if you need distributed locking (like redlock)?
Research this question later on.

const redisClusterOptions = [
  {host: process.env.REDIS_HOST, port: 6380, password: process.env.REDIS_PASSWORD},
  {host: process.env.REDIS_HOST, port: 6381, password: process.env.REDIS_PASSWORD}
];
const elasticacheWithTLS = {
  dnsLookup: (address, callback) => callback(null, address),
  redisOptions: {tls: {}}
};
const pubClient = new Redis.Cluster(redisClusterOptions, elasticacheWithTLS);
const subClient = new Redis.Cluster(redisClusterOptions, elasticacheWithTLS);
*/

/*const socketAuth = (socket, next) => {
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
};*/


// session
/*
const RedisStore = connectRedis(expressSession);
const redisSession = new RedisStore({client: sessClient});
const sessionOptions = {
  store: redisSession,
  name: "connect.sid",
  secret: process.env.SESSION_SECRET || "secret",
  resave: true,
  saveUninitialized: true,
  cookie: {
    sameSite: false,
    maxAge: 86400000,
    httpOnly: false,
    secure: false
  },
  unset: "destroy"
};
const session = expressSession(sessionOptions);
*/


// prod
if (app.get('env') === 'production') {
  app.set('trust proxy', 1);  // trust first proxy
  /*sessionOptions.cookie = {
    sameSite: true,
    maxAge: 86400000,
    httpOnly: true,
    secure: true
  };*/
  corsOptions.origin = ['https://nobullshitcooking.net'];
}  // enforce https? or elasticbeanstalk already does?



/*##############################################################################
2. middleware
##############################################################################*/

//app.use(expressPinoLogger());
app.use(express.json());
//app.use(session);
app.use(expressRateLimit(rateLimiterOptions));
//app.use(session);
app.use(cors(corsOptions));
//app.use(helmet());  // get working
//app.use(hpp());
app.use(expressSanitizer());  // must be called after express.json()
app.use(helmet());
//app.use(csurf());  // must be called after cookies/sessions  // https://github.com/pillarjs/understanding-csrf
app.use(compression());  // elasticbeanstalk/nginx already does?

// move these
/*
io.adapter(redisAdapter({pubClient, subClient}));
io.use(socketAuth);
io.on('connection', socketConnection);
*/
//const INTERVAL = 60 * 60 * 1000 * 3;  // 3 hours
const MINTERVAL = 30 * 1000;  // 30 seconds
//setInterval(cleanUp, INTERVAL);

//let wait = ms => new Promise(resolve => setTimeout(resolve, ms));
/*let fooOne = async () => {
  await wait(20000);
  const rV1 = await cleanUp();
  console.log('rV1: ', rV1);
  const rV2 = await cleanUp();
  console.log('rV2: ', rV2);
  await wait(20000);
  const rV3 = await cleanUp();
  console.log('rV3: ', rV3);
  const rV4 = await cleanUp();
  console.log('rV4: ', rV4);
};
fooOne();*/
/*(async function() {
  try {
    setTimeout(() => {
      const rV1 = await cleanUp();
      console.
      const rV2 = await cleanUp();
      console.log('`after` 1 and 2');
    }, 20000);  // at the 20 second mark
    setTimeout(() => {
      cleanUp();
      cleanUp();
      console.log('`after` 3 and 4');
    }, 40000);  // at the 40 second mark
    setTimeout(() => {
      cleanUp();
      cleanUp();
      console.log('`after` 5 and 6');
    }, 60000);  // at the 60 second mark
  } catch(err) {
    console.log(err);
  }
})();*/
const fooOne = async () => {
  try {
    console.log('fooOne call START');
    workerClient.set("foo", "bar");
    const worker = workerClient.get("foo", function(err, result) {
      if (err) {
        console.error(err);
      } else {
        console.log(result);
      }
    });
    console.log(worker);
    workerClient.get("foo", function(err, result) {
      if (err) {
        console.error(err);
      } else {
        console.log(result);
      }
    });
    workerClient.get("foo").then(function(result) {
      console.log(result);
    });
    workerClient.get("foo").then(function(result) {
      console.log(result);
    });
    workerClient.del("foo");
    console.log('fooOne call END');
  } catch(err) {
    console.log(err);
  }
};
setInterval(fooOne, MINTERVAL);

/*setInterval(() => io.of('/').adapter.clients((err, clients) => {
  console.log(clients); // an array containing all connected socket ids
}), (60 * 1000));*/

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

let blah = 1;
app.get('/', (req, res) => {
  try {
    blah = blah + 1;
    console.log(blah);
    console.log(`No Bullshit Cooking Backend API.`);
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

// NOT for prod
app.use((error, req, res, next) => {
  //req.log.error(error);
  res.json({error: {message: error.message, status: error.status || 500}});
});



/*##############################################################################
5. listen
##############################################################################*/

let PORT;

if (app.get('env') === 'production') {
  PORT = process.env.PORT || 8081;
  //server.listen(PORT, '127.0.0.1', () => console.log('Listening on port ' + PORT));
  app.listen(PORT, '127.0.0.1', () => console.log('Listening on port ' + PORT));
} else {
  PORT = process.env.PORT || 3003;
  //server.listen(PORT, '0.0.0.0', () => console.log('Listening on port ' + PORT));
  server.listen(PORT, '0.0.0.0', () => console.log('Listening on port ' + PORT));
}
