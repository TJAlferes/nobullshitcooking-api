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
const sessionFileStore = require('session-file-store');
//const redis = require('redis');
//const connectRedis = require('connect-redis');  // Not using yet, simply storing sessions with `session-file-store` for now

const http = require('http');
const socketIO = require('socket.io');
const sharedSession = require('express-socket.io-session');
const adapter = require('socket.io-redis');
const emitter = require('socket.io-emitter');

//const { buildSchema } = require('graphql');
//const expressGraphQL = require('express-graphql');

const sgMail = require('@sendgrid/mail');  // DELETE ME!!!  DELETE ME!!!  DELETE ME!!!

const {
  equipmentRoutes,
  equipmentTypeRoutes,
  ingredientRoutes,
  ingredientTypeRoutes,
  recipeRoutes,
  recipeTypeRoutes,
  cuisineRoutes,
  measurementRoutes,
  favoriteRecipeRoutes,
  staffRoutes,
  userRoutes
} = require('./routes');



/*##############################################################################
1. setup
##############################################################################*/

const app = express();

const FileStore = sessionFileStore(session);
//const RedisStore = connectRedis(session);  // Not using yet, simply storing session in filesystem for now
//const RedisClient = redis.createClient({host: 'redis-dev'}); 
//const RedisClient = redis.createClient(process.env.REDIS_URI);

const sessionOptions = {
  store: new FileStore,
  name: 'connect.sid',
  secret: 'very secret',
  resave: true,  // false before socket.io
  saveUninitialized: true,  // false before socket.io
  cookie: {}
};
/*const sessionOptions = {
  store: new RedisStore({
    port: process.env.REDIS_PORT || "6379",
    host: process.env.REDIS_HOST || "localhost"
  }),
  secret: process.env.SESSION_SECRET || "secret",
  name: "session",
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: true,
    maxAge: 86400000,
    httpOnly: true,
    secure: true
  }
};*/

const corsOptions = {origin: ['http://localhost:8080'], credentials: true};

if (app.get('env') === 'production') {
  app.set('trust proxy', 1);  // trust first proxy
  sessionOptions.cookie.secure = true;  // serve secure cookies
  corsOptions.origin = ['https://nobullshitcooking.net'];
}

// limit each IP to 100 requests per minute
const rateLimiterOptions = {windowMs: 1 * 60 * 1000, max: 100};

const server = http.Server(app);
const io = socketIO(server);
const pubClient = redis(process.env.REDIS_PORT, process.env.REDIS_HOST, {
  auth_pass: process.env.REDIS_PASSWORD
});
const subClient = redis(process.env.REDIS_PORT, process.env.REDIS_HOST, {
  return_buffers: true,
  auth_pass: process.env.REDIS_PASSWORD
});

/*##############################################################################
2. middleware
##############################################################################*/

app.use(expressPinoLogger());
app.use(expressRateLimit(rateLimiterOptions));
/*app.use(
  session({
    store: new RedisStore({
      port: process.env.REDIS_PORT || "6379",
      host: process.env.REDIS_HOST || "localhost"
    }),
    secret: process.env.SESSION_SECRET || "secret",
    name: "session",
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: true,
      maxAge: 86400000,
      httpOnly: true,
      secure: true
    }
  })
);*/
app.use(session(sessionOptions));
app.use(cors(corsOptions));  // before session?
//app.use(compression());  // elasticbeanstalk already does?
//app.use(helmet());  // get working
//app.use(hpp());
//app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
app.use(expressSanitizer());  // must be called after express.json()
app.use(helmet());
//app.use(cors());
// https://github.com/pillarjs/understanding-csrf
//app.use(csurf());  // must be called after cookies/sessions
app.use(compression());

io.set('transports', ['websocket']);
io.adapter(adapter({pubClient, subClient}));
io.of('/messenger').use(sharedSession(session, {autoSave: true}));

/*##############################################################################
3. routes
##############################################################################*/

app.get('/', (req, res) => {
  try {



    // DELETE ME!!!  DELETE ME!!!  DELETE ME!!!
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: 'test@example.com',
      from: 'test@example.com',
      subject: 'Sending with Twilio SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };
    sgMail.send(msg);
    // DELETE ME!!!  DELETE ME!!!  DELETE ME!!!



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
app.use('/measurement', measurementRoutes);
app.use('/favorite-recipe', favoriteRecipeRoutes);
app.use('/staff', staffRoutes);
app.use('/user', userRoutes);
//app.use('/graphql', expressGraphQL({schema, rootValue, graphiql: true}));



/*##############################################################################
4. errors
##############################################################################*/

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', reason.stack || reason);
});

app.use((error, req, res, next) => {
  req.log.error(error)
  res.status(error.status || 500).json({error: {message: error.message}});
});



/*##############################################################################
5. listen
##############################################################################*/

const PORT = process.env.PORT || 3003;

server.listen(80);  //app.listen(PORT, () => console.log('Listening on port ' + PORT));
