'use strict';

const { workerClient } = require('../lib/connections/redisConnection');

const DELTA = 60 * 60 * 1000 * 2;  // 2 hours

async function cleanUpRooms() {
  try {
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
  } catch (err) {
    console.log(err);
  }
}

async function cleanUpChats() {
  try {
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
  } catch (err) {
    console.log(err);
  }
}

const cleanUp = async function() {
  console.log('Clean Up Isle NOBSC Messenger (START)');
  await cleanUpRooms();
  await cleanUpChats();
  console.log('Clean Up Isle NOBSC Messenger (END)');
}

module.exports = cleanUp;