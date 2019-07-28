//const client = require();

const DELTA = 60 * 60 * 1000 * 3;
const INTERVAL = 60 * 60 * 1000 * 2;

function cleanUpRooms() {
  client.zrangebyscore(
    'rooms',
    '-inf',
    ((new Date).getTime() - DELTA),
    function(err, rooms) {
      if (err !== null) {
        console.log(err);
      } else {
        rooms.forEach(function(room) {
          client.multi()
          .zrem('rooms', room)
          .del(`rooms:${room}:chats`)
          .exec();
        });
      }
    }
  );
}

function cleanUpChats() {
  client.zrange(
    'rooms',
    0,
    -1,
    function(err, rooms) {
      rooms.forEach(function(room) {
        client.zremrangebyscore(
          `rooms:${room}:chats`,
          '-inf',
          ((new Date).getTime() - DELTA)
        );
      });
    }
  );
}

function cleanUpUsers() {
  client.zrangebyscore(
    'users',
    '-inf',
    ((new Date).getTime() - DELTA),
    function(err, users) {
      users.forEach(function(room) {
        client.multi()
        .zrem('users', user)
        .del(`user:${user}`)
        .del(`user:${user}:room`)
        .exec();
      });
    }
  );
}

function cleanUp() {
  cleanUpRooms();
  cleanUpChats();
  cleanUpUsers();
}

setInterval(cleanUp, INTERVAL);
cleanUp();