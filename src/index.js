'use strict';

//require('babel-polyfill');  // pollutes globals?

require('dotenv').config();

const express = require('express');
const expressRateLimit = require('express-rate-limit');
const expressPinoLogger = require('express-pino-logger');
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
//const sharedSession = require('express-socket.io-session');
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
  savedRecipeRoutes,
  friendshipRoutes,
  staffRoutes,
  userRoutes,
  signS3Images1
} = require('./routes');
const socketConnection = require('./chat');
const MessengerUser = require('./redis-access/MessengerUser');  // move
const client = require('./lib/connections/redisConnection');



/*##############################################################################
1. setup
##############################################################################*/

// Note to self: Move a lot of this to a separate init module? Export app so you can do integration testing easily?

// app
const app = express();
const rateLimiterOptions = {windowMs: 1 * 60 * 1000, max: 100};  // limit each IP to 100 requests per minute  // affect socket?
const corsOptions = {origin: ['http://localhost:8080'], credentials: true};


// chat    // move
const server = http.Server(app);
const io = socketIO(server);
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
const socketAuth = (socket, next) => {
  const parsedCookie = cookie.parse(socket.request.headers.cookie);
  const sid = cookieParser.signedCookie(parsedCookie['connect.sid'], process.env.SESSION_SECRET);
  if (parsedCookie['connect.sid'] === sid) return next(new Error('Not authenticated.'));
  redisSession.get(sid, function(err, session) {
    if (session.isAuthenticated) {
      socket.request.user = session.passport.user;
      socket.request.sid = sid;
      const messengerUser = new MessengerUser(client);
      messengerUser.addUser(session.userInfo.userId, session.userInfo.username);
      return next();
    } else {
      return next(new Error('Not authenticated.'));
    }
  });
};


// session
const RedisStore = connectRedis(session);
const redisSession = new RedisStore({
  client,
  pass: process.env.REDIS_PASSWORD
});
const sessionOptions = {
  store: redisSession,
  name: "connect.sid",  //"session",
  secret: process.env.SESSION_SECRET || "secret",
  resave: true,  //false,
  saveUninitialized: true,  //false,
  cookie: {
    sameSite: true,
    maxAge: 86400000,
    httpOnly: true,
    secure: true
  }
};
const session = expressSession(sessionOptions);


// prod
if (app.get('env') === 'production') {
  app.set('trust proxy', 1);  // trust first proxy
  sessionOptions.cookie.secure = true;  // serve secure cookies
  corsOptions.origin = ['https://nobullshitcooking.net'];
}
//enforce https? or elasticbeanstalk already does?


/*##############################################################################
2. middleware
##############################################################################*/

app.use(expressPinoLogger());
app.use(expressRateLimit(rateLimiterOptions));
app.use(session);  // sharedSession? **********!!!  // do you have to preset one?  // now preset
app.use(cors(corsOptions));  // before session?
//app.use(helmet());  // get working
//app.use(hpp());
app.use(express.json());
app.use(expressSanitizer());  // must be called after express.json()
app.use(helmet());
//app.use(cors());
//app.use(csurf());  // must be called after cookies/sessions  // https://github.com/pillarjs/understanding-csrf
app.use(compression());  // elasticbeanstalk already does?

io.set('transports', ['websocket']);  // ...eh?
io.adapter(redisAdapter(client));
//io.use(sharedSession(session, {autoSave: true}));    // do you have to preset one?  // now preset  // back to expressSession?
io.use(socketAuth);
/*io.nsps.forEach(function(nsp) {
  nsp.on('connect', socket => {
    if (!socket.auth) delete nsp.connected[socket.id];
  });
});*/
io.on('connect', socketConnection);  // connection ?



/*##############################################################################
3. routes
##############################################################################*/

app.get('/', (req, res) => {
  try {
    res.send("No Bullshit Cooking Backend API");
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
app.use('/saved-recipe', savedRecipeRoutes)
app.use('/friendship', friendshipRoutes);
app.use('/staff', staffRoutes);
app.use('/user', userRoutes);
app.use('/sign-s3-images-1', signS3Images1);
//app.use('/graphql', expressGraphQL({schema, rootValue, graphiql: true}));



/*##############################################################################
4. errors
##############################################################################*/

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', reason.stack || reason);
});

app.use((error, req, res, next) => {
  //req.log.error(error);
  res.status(error.status || 500).json({error: {message: error.message}});
});



/*##############################################################################
5. listen
##############################################################################*/

const PORT = process.env.PORT || 3003;

server.listen(PORT, () => console.log('Listening on port ' + PORT));