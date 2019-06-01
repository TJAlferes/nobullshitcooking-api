'use strict';
//require('babel-polyfill');  // pollutes globals?
require('dotenv').config();
const express = require('express');
const session = require("express-session");
const sessionFileStore = require('session-file-store');
//const redis = require('redis');
//const connectRedis = require('connect-redis');  // Not using yet, simply storing session in filesystem for now
//const expressRateLimit = require('express-rate-limit);
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
//const csurf = require('csurf');
//const hpp = require('hpp');
//const morgan = require('morgan');
const bodyParser = require('body-parser');

const {
  equipmentRoutes,
  equipmentTypeRoutes,
  ingredientRoutes,
  ingredientTypeRoutes,
  recipeRoutes,
  recipeTypeRoutes,
  cuisineRoutes,
  measurementRoutes,
  staffRoutes,
  userRoutes
} = require('./routes');

// TO DO: Possibly remove try catch blocks in controllers

/*

1. setup

*/
const app = express();
const FileStore = sessionFileStore(session);
//const RedisStore = connectRedis(session);  // Not using yet, simply storing session in filesystem for now
//const RedisClient = redis.createClient({host: 'redis-dev'}); 
//const RedisClient = redis.createClient(process.env.REDIS_URI);

const sessionOptions = {
  store: new FileStore,
  name: 'connect.sid',
  secret: 'very secret',
  resave: false,
  saveUninitialized: false,
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



/*

2. connect third-party middleware

*/
//app.use(expressRateLimit());
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
//app.use(compression());
//app.use(helmet());
//app.use(hpp());
//app.use(morgan());
//app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());  // or new built-in middleware: app.use(express.json())
app.use(helmet());
//app.use(cors());
// https://github.com/pillarjs/understanding-csrf
//app.use(csurf());  // must be called after cookies/sessions
app.use(compression());



/*

3. connect our routes

*/
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
app.use('/measurement', measurementRoutes);
app.use('/staff', staffRoutes);
app.use('/user', userRoutes);



/*

4. handle errors

*/
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', reason.stack || reason);
});

/*app.use((req, res, next) => {
  const error = new Error('Not found!!!');
  error.status = 404;
  next(error);
});*/

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

/*app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.use((error, req, res, next) => {
  logger.error(error);
  res.status(error.status || 500)
  .json({
    error: error.message
  });
});*/



/*

5. listen

*/
const PORT = process.env.PORT || 3003;

app.listen(PORT, () => console.log('Listening on port ' + PORT));