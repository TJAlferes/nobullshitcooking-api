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

const session = require("express-session");
const Redis = require('ioredis');
const connectRedis = require('connect-redis');

const http = require('http');
const socketIO = require('socket.io');
const sharedSession = require('express-socket.io-session');
const adapter = require('socket.io-redis');

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



/*##############################################################################
1. setup
##############################################################################*/


// app
const app = express();
const rateLimiterOptions = {windowMs: 1 * 60 * 1000, max: 100};  // limit each IP to 100 requests per minute  // affect socket?
const corsOptions = {origin: ['http://localhost:8080'], credentials: true};


// chat
const server = http.Server(app);
const io = socketIO(server);
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


// session
const sessClient = new Redis({host: process.env.REDIS_HOST, port: 6379});
const RedisStore = connectRedis(session);  // sharedSession? **********!!!
const sessionOptions = {
  store: new RedisStore({client: sessClient, pass: process.env.REDIS_PASSWORD}),
  name: "connect.sid",  //"session",
  secret: process.env.SESSION_SECRET || "secret",
  resave: true,  //false,
  saveUninitialized: true,  //false,
  cookie: {sameSite: true, maxAge: 86400000, httpOnly: true, secure: true}
};


// prod
if (app.get('env') === 'production') {
  app.set('trust proxy', 1);  // trust first proxy
  sessionOptions.cookie.secure = true;  // serve secure cookies
  corsOptions.origin = ['https://nobullshitcooking.net'];
}



/*##############################################################################
2. middleware
##############################################################################*/

app.use(expressPinoLogger());
app.use(expressRateLimit(rateLimiterOptions));
app.use(session(sessionOptions));  // sharedSession? **********!!!
app.use(cors(corsOptions));  // before session?
//app.use(compression());  // elasticbeanstalk already does?
//app.use(helmet());  // get working
//app.use(hpp());
app.use(express.json());
app.use(expressSanitizer());  // must be called after express.json()
app.use(helmet());
//app.use(cors());
//app.use(csurf());  // must be called after cookies/sessions  // https://github.com/pillarjs/understanding-csrf
app.use(compression());

io.set('transports', ['websocket']);
io.adapter(adapter({pubClient, subClient}));
//io.of('/messenger').use(sharedSession(session, {autoSave: true}));
io.use(sharedSession(session, {autoSave: true}));



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