//const expressPinoLogger = require('express-pino-logger');
const expressRateLimit = require('express-rate-limit');
const expressSanitizer = require('express-sanitizer');  // Use something else? This is popular, yet is based on abandonware...
const cors = require('cors');
const helmet = require('helmet');
//const hpp = require('hpp');
//const csurf = require('csurf');  // no longer needed?
const compression = require('compression');

const sessionInit = require('./sessionInit');

function middlewareInit(app) {
  const rateLimiterOptions = {windowMs: 1 * 60 * 1000, max: 1000};  // limit each IP to 1000 requests per minute (100?)

  const corsOptions = {origin: ['http://localhost:8080'], credentials: true};
  
  if (app.get('env') === 'production') {
    app.set('trust proxy', 1);  // trust first proxy
    corsOptions.origin = ['https://nobullshitcooking.com'];
  }
  
  const session = sessionInit(app, server);
  
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
}

module.exports = middlewareInit;