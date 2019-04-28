'use strict';
//require('babel-polyfill');  // pollutes globals?
require('dotenv').config();
const express = require('express');
const session = require("express-session");

//const redis = require('redis');
//const RedisStore = require("connect-redis")(session);  // Not using yet, simply storing session in filesystem for now
//const expressRateLimit = require('express-rate-limit);
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const csurf = require('csurf');
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
  staffRoutes,
  userRoutes
} = require('./routes');

const app = express();

//const RedisClient = redis.createClient({host: 'redis-dev'});
//const RedisClient = redis.createClient(process.env.REDIS_URI);

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

//app.use(express.json()); ?


let sessionOptions = {
  secret: 'very secret',
  resave: false,
  saveUninitialized: false,
  cookie: {}
};

if (app.get('env') === 'production') {
  app.set('trust proxy', 1);  // trust first proxy
  sessionOptions.cookie.secure = true;  // serve secure cookies
}



/*

third-party middleware

*/
//app.use(expressRateLimit());
app.use(session(sessionOptions));
app.use(cors());  // before session?
//app.options('*', cors())
//app.use(cors());
//app.use(compression());
//app.use(helmet());
//app.use(hpp());
//app.use(morgan());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());  // or new built-in middleware: app.use(express.json())
// (or
//const urlencodedParser = bodyParser.urlencoded({extended: false});
//const jsonParser = bodyParser.json();
// and manually apply them as second argument to route methods)
//app.use(session({secret: 'very secret', resave: false, saveUninitialized: false}));  // move up?
//app.use(csurf());  // must be called after cookies/sessions
app.use(helmet());
//app.use(cors());
app.use(csurf());  // must be called after cookies/sessions  // TO DO ASAP: find out why this is causing 403s on POST but not on GET, also, what are the 204 no contents all about?
app.use(compression());



/*

our routes

*/
app.get('/', (req, res) => {
  try {
    res.send("No Bullshit Cooking Backend API");
  } catch(err) {
    console.log(err);
  }
});
app.get('/auth/get-csrf-token', (req, res) => {
  try {
    res.json({csrfToken: '123456'});
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
app.use('/staff', staffRoutes);
app.use('/user', userRoutes);



/*
if (process.env.NODE_ENV === 'production') {

}
*/

/*app.all("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});*/

// handle errors
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

/*
app.use((error, req, res, next) => {
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
});
*/


const PORT = process.env.PORT || 3003;

app.listen(PORT, () => console.log('Listening on port ' + PORT));