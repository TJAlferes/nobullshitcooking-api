//require('babel-polyfill');  // pollutes globals?
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
//const hpp = require('hpp');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const equipment = require('./routes/equipment');
const ingredients = require('./routes/ingredients');
const recipes = require('./routes/recipes');



const app = express();
const pool = mysql.createPool({
  //host: process.env.DB_HOST,
  //user: process.env.DB_USER,
  //password: process.env.DB_PASSWORD,
  //database: process.env.DB_DATABASE,
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DB_NAME,
  waitForConnections: process.env.DB_WAIT_FOR_CONNECTIONS,
  connectionLimit: process.env.DB_CONNECTION_LIMIT,
  queueLimit: process.env.DB_QUEUE_LIMIT
});



// First, set up third-party middleware
app.use(compression());
app.use(cors());
app.use(helmet());
//app.use(hpp());
app.use(morgan());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());



// Then, define all our routes
// 0. main
app.get('/', (req, res) => {
  try {
    const message = "No Bullshit Cooking Backend API";
  
    res.send(message);

  } catch(err) {
    console.log(err);
  }
});

app.use('/equipment', equipment);
app.use('/ingredients', ingredients);
app.use('/recipes', recipes);



// Lastly, handle errors
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});



const PORT = process.env.PORT || 3003;

app.listen(PORT, () => console.log('Listening on port ' + PORT));