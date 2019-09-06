'use strict';

const { workerClient } = require('../lib/connections/redisConnection');

const DELTA = 30 * 60 * 1000 * 1;  // 30 minutes

async function cleanUpRooms() {
  await workerClient.zrangebyscore(
    'rooms',
    '-inf',
    ((new Date).getTime() - DELTA),
    function(err, rooms) {
      if (err !== null) {
        console.log(err);
      } else {
        rooms.forEach(function(room) {
          workerClient
          .multi()
          .zrem('rooms', room)
          .del(`rooms:${room}:chats`)
          .exec();

          workerClient.zrangebyscore(
            'users',
            '-inf',
            ((new Date).getTime() - DELTA),
            function(err, users) {
              if (err !== null) {
                console.log(err);
              } else {
                users.forEach(function(user) {
                  workerClient.zrem(`rooms:${room}`, user);
                });
              }
            }
          );
        });
      }
    }
  );
}

async function cleanUpChats() {
  await workerClient.zrange(
    'rooms',
    0,
    -1,
    function(err, rooms) {
      workerClient.zrangebyscore(
        'rooms',
        '-inf',
        ((new Date).getTime() - DELTA),
        function(err, rooms) {
          if (err !== null) {
            console.log(err);
          } else {
            rooms.forEach(function(room) {
              workerClient.zremrangebyscore(
                `rooms:${room}:chats`,
                '-inf',
                ((new Date).getTime() - DELTA)
              );
            });
          }
        }
      );
    }
  );
}

async function cleanUpUsers() {
  await workerClient.zrangebyscore(
    'users',
    '-inf',
    ((new Date).getTime() - DELTA),
    function(err, users) {
      if (err !== null) {
        console.log(err);
      } else {
        users.forEach(function(user) {
          workerClient
          .multi()
          .zrem('users', user)
          .del(`user:${user}`)
          .del(`user:${user}:room`)
          .exec();
        });
      }
    }
  );
}

const cleanUp = async function() {
  console.log('Clean Up Isle NOBSC Messenger');
  await cleanUpRooms();
  await cleanUpChats();
  await cleanUpUsers();
}

module.exports = cleanUp;