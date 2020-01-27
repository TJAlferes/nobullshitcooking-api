'use strict';

const http = require('http');
const express = require('express');

const middlewareInit = require('./middlewareInit');
const routesInit = require('./routesInit');
//const bulkUp = require('./search');

const app = express();
const server = http.Server(app);

// move this, and create startup conditional
/*try {
  setTimeout(() => {
    console.log('Now running bulkUp.');
    bulkUp();
  }, 60000);  // at the 1 minute mark
} catch(err) {
  console.log(err);
}*/

/*
middlewareInit then calls sessionInit,
and sessionInit in turn calls socketInit

typically we want to avoid such triple nesting,
however here it seems unavoidable,
because of the dependent relationships of these things
*/
middlewareInit(app);  // must run before routesInit
routesInit(app);

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