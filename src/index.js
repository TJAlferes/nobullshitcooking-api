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
//const sessionFileStore = require('session-file-store');
const ioredis = require('ioredis');
const connectRedis = require('connect-redis');

const http = require('http');
const socketIO = require('socket.io');
const sharedSession = require('express-socket.io-session');
const adapter = require('socket.io-redis');
//const emitter = require('socket.io-emitter');  // needed?

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
  measurementRoutes,
  favoriteRecipeRoutes,
  friendshipRoutes,
  staffRoutes,
  userRoutes
} = require('./routes');



/*##############################################################################
1. setup
##############################################################################*/

const app = express();

//const FileStore = sessionFileStore(session);
//const RedisStore = connectRedis(session);  // Not using yet, simply storing session in filesystem for now
//const RedisClient = redis.createClient({host: 'redis-dev'}); 
//const RedisClient = redis.createClient(process.env.REDIS_URI);

/*const sessionOptions = {
  store: new FileStore,
  name: 'connect.sid',
  secret: 'very secret',
  resave: true,  // false before socket.io
  saveUninitialized: true,  // false before socket.io
  cookie: {}
};*/
const sessionOptions = {
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
};

const RedisStore = connectRedis(session);

const corsOptions = {origin: ['http://localhost:8080'], credentials: true};

if (app.get('env') === 'production') {
  app.set('trust proxy', 1);  // trust first proxy
  sessionOptions.cookie.secure = true;  // serve secure cookies
  corsOptions.origin = ['https://nobullshitcooking.net'];
}

// limit each IP to 100 requests per minute
const rateLimiterOptions = {windowMs: 1 * 60 * 1000, max: 100};  // affect socket?

const server = http.Server(app);
const io = socketIO(server);
const pubClient = redis(process.env.REDIS_PORT, process.env.REDIS_HOST, {
  auth_pass: process.env.REDIS_PASSWORD
});
const subClient = redis(process.env.REDIS_PORT, process.env.REDIS_HOST, {
  return_buffers: true,
  auth_pass: process.env.REDIS_PASSWORD
});

// SCALABLE PUB SUB? SEE YOUTUBE VID
// CLIENTS SEE REDLOCK IOREDIS

//var client = require('./index').client;
//var models = require('./models');

function addUser(user, name, type) {
  client.multi()
  .hset('user:' + user, 'name', name)
  .hset('user:' + user, 'type', type)
  .zadd('users', Date.now(), user)
  .exec();
};

function addRoom(room) {
  if (room !== '') client.zadd('rooms', Date.now(), room);
};

function getRooms(cb){
  client.zrevrangebyscore('rooms', '+inf', '-inf', function(err, data) {
    return cb(data);
  });
};

function addChat(chat) {
  client.multi()
  .zadd('rooms:' + chat.room + ':chats', Date.now(), JSON.stringify(chat))
  .zadd('users', (new Date).getTime(), chat.user.id)
  .zadd('rooms', (new Date).getTime(), chat.room)
  .exec();
};

function getChat(room, cb){
  client.zrange('rooms:' + room + ':chats', 0, -1, function(err, chats) {
    cb(chats);
  });
};

function addUserToRoom(user, room) {
  client.multi()
  .zadd('rooms:' + room, Date.now(), user)
  .zadd('users', Date.now(), user)
  .zadd('rooms', Date.now(), room)
  .set('user:' + user + ':room', room)
  .exec();
}

function removeUserFromRoom(user, room) {
  client.multi()
  .zrem('rooms:' + room, user)
  .del('user:' + user + ':room')
  .exec();
};

// HEAVILY EDIT
function getUsersinRoom(room){
  return Promise(function(resolve, reject) {
    client.zrange('rooms:' + room, 0, -1, function(err, data) {
      var users = [];
      var loopsleft = data.length;
      data.forEach(function(u){
        client.hgetall('user:' + u, function(err, userHash){
          users.push(models.User(u, userHash.name, userHash.type));
          loopsleft--;
          if (loopsleft === 0) resolve(users);
        });
      });
    });
  });
};



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
app.use(session(sessionOptions));  // sharedSession?
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

//io.of('/messenger').use(sharedSession(session, {autoSave: true}));
io.use(sharedSession(session, {autoSave: true}));


io.nsps.forEach(function(nsp) {
  nsp.on('connect', socket => {
    if (!socket.auth) delete nsp.connected[socket.id];
  });
});

io.on('connection', socket => {

  socket.auth = false;

  socket.on('authenticate', async function(socket, data) {
    try {
      const user = await verifyUser(data.token);  // send token to client, client sends token back here?
      //const user = {id: socket.handshake.session.userInfo.;
      const canConnect = await ioredis.setAsync(`users:${user.id}`, socket.id, 'NX', 'EX', 30);
      if (!canConnect) {
        return socket.emit('unauthorized', {message: 'ALREADY_LOGGED_IN'}, function() {
          if (socket.user) await ioredis.delAsync(`users:${socket.user.id}`);
        });
      }

      socket.user = user;
      socket.auth = true;

      io.nsps.forEach(function(nsp) {
        if (nsp.sockets.find(el => el.id === socket.id)) {
          nsp.connected[socket.id] = socket;
        }
      });

      socket.emit('authenticated', true);

      return async (socket) => {
        socket.conn.on('packet', async (packet) => {
          if (socket.auth && packet.type === 'ping') {
            await ioredis.setAsync(`users:${socket.user.id}`, socket.id, 'XX', 'EX', 30);
          }
        });
      };
    } catch (err) {
      if (err) {
        socket.emit('unauthorized', {message: err.message}, function() {
          if (socket.user) await ioredis.delAsync(`users:${socket.user.id}`);
        });
      } else {
        socket.emit('unauthorized', {message: 'Authentication failure'}, function() {
          if (socket.user) await ioredis.delAsync(`users:${socket.user.id}`);
        });
      }
    }
  });

  socket.on('disconnect', function(socket) {
    if (socket.user) await ioredis.delAsync(`users:${socket.user.id}`);
  });

  setTimeout(() => {
    if (!socket.auth) {
      if (socket.user) await ioredis.delAsync(`users:${socket.user.id}`);
    }
  }, 1000);

});



/*##############################################################################
3. routes
##############################################################################*/

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
app.use('/favorite-recipe', favoriteRecipeRoutes);
app.use('/friendship', friendshipRoutes);
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
