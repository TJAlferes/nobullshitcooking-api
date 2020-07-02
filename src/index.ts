'use strict';

//require('babel-polyfill');  // pollutes globals?
//require('core-js/stable');  // 'core-js'
require('regenerator-runtime/runtime');
require('dotenv').config();

const { app, server } = require('./app');

let PORT: number;

if (app.get('env') === 'production') {
  PORT = Number(process.env.PORT) || 8081;
  server
  .listen(PORT, '127.0.0.1', () => console.log('Listening on port ' + PORT));
} else if (app.get('env') === 'test') {
  PORT = Number(process.env.TEST_PORT) || 3004;
  server
  .listen(PORT, '0.0.0.0', () => console.log('Listening on port ' + PORT));
} else if (app.get('env') === 'development') {
  PORT = Number(process.env.DEV_PORT) || 3003;
  server
  .listen(PORT, '0.0.0.0', () => console.log('Listening on port ' + PORT));
}