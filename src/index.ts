'use strict';

//require('babel-polyfill');  // pollutes globals?
//require('core-js/stable');  // 'core-js'
require('regenerator-runtime/runtime');
require('dotenv').config();

import { app, server } from './app';

let PORT: string | number;

if (app.get('env') === 'production') {
  PORT = process.env.PORT || 8081;
  server.listen(PORT, '127.0.0.1', () => console.log('Listening on port ' + PORT));
} else {
  PORT = process.env.PORT || 3003;
  server.listen(PORT, '0.0.0.0', () => console.log('Listening on port ' + PORT));
}