'use strict';

const http = require('http');
const express = require('express');
//const expressPinoLogger = require('express-pino-logger');
const expressRateLimit = require('express-rate-limit');
const expressSanitizer = require('express-sanitizer');  // Use something else? This is popular, yet is based on abandonware...
const cors = require('cors');
const helmet = require('helmet');
//const hpp = require('hpp');
//const csurf = require('csurf');  // no longer needed?
const compression = require('compression');
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

const socketInit = require('./socketInit');

//const bulkUp = require('./search');

const app = express();
const server = http.Server(app);

const rateLimiterOptions = {windowMs: 1 * 60 * 1000, max: 1000};  // limit each IP to 1000 requests per minute (100?)

const corsOptions = {origin: ['http://localhost:8080'], credentials: true};

if (app.get('env') === 'production') {
  app.set('trust proxy', 1);  // trust first proxy
  corsOptions.origin = ['https://nobullshitcooking.com'];
}

const session = sessionInit(app);

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

socketInit();

// move this, and create startup conditional
/*try {
  setTimeout(() => {
    console.log('Now running bulkUp.');
    bulkUp();
  }, 60000);  // at the 1 minute mark
} catch(err) {
  console.log(err);
}*/

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

module.exports = {app, server};