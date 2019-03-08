//require('babel-polyfill');  // pollutes globals?
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const session = require("express-session");

// Not using yet, simply storing session in filesystem for now
//const redis = require('redis');
//const RedisStore = require("connect-redis")(session);

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
  ingredientRoutes,
  recipeRoutes,
  userRoutes,
  staffRoutes
} = require('./routes');

const app = express();

//const RedisClient = redis.createClient({host: 'redis-dev'});
//const RedisClient = redis.createClient(process.env.REDIS_URI);

// why is this here?
// also, move into a default export?
const pool = process.env.NODE_ENV === 'production'
? mysql.createPool({
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DB_NAME,
  waitForConnections: process.env.DB_WAIT_FOR_CONNECTIONS,
  connectionLimit: process.env.DB_CONNECTION_LIMIT,
  queueLimit: process.env.DB_QUEUE_LIMIT
})
: mysql.createPool({
  //host: 'mysql-dev'
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: process.env.DB_WAIT_FOR_CONNECTIONS,
  connectionLimit: process.env.DB_CONNECTION_LIMIT,
  queueLimit: process.env.DB_QUEUE_LIMIT
});

app.disable('x-powered-by'); // doesn't csurf do this for you?

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

// third-party middleware
//app.use(expressRateLimit());
app.use(compression());
app.use(cors());
app.use(helmet());
app.use(csurf());  // move up?
//app.use(hpp());
//app.use(morgan());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());  // or new built-in middleware: app.use(express.json())
// (or
//const urlencodedParser = bodyParser.urlencoded({extended: false});
//const jsonParser = bodyParser.json();
// and manually apply them as second argument to route methods)
app.use(session({secret: 'very secret', resave: false, saveUninitialized: true}));  // move up?

// our routes
app.get('/', (req, res) => {
  try {
    res.send("No Bullshit Cooking Backend API");
  } catch(err) {
    console.log(err);
  }
});
app.use('/equipment', equipmentRoutes);
app.use('/ingredients', ingredientRoutes);
app.use('/recipes', recipeRoutes);
app.use('/user', userRoutes);
app.use('/staff', staffRoutes);



/*
if (process.env.NODE_ENV === 'production') {

}
*/

/*app.all("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});*/

// handle errors
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

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