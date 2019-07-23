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