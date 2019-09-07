'use strict';

const { workerClient } = require('../lib/connections/redisConnection');

//const DELTA = 30 * 60 * 1000 * 1;  // 30 minutes
const DELTA = 30 * 1000; // 30 seconds

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

async function cleanUpUsers(activeSessions) {
  const users = await workerClient.zrangebyscore(
    'users',
    '-inf',
    ((new Date).getTime() - DELTA)
  );

  for (let user of users) {
    const doesExist = await workerClient.hexists(`user:${user}`, 'sid');
    if (doesExist === 1) {
      const userSID = await workerClient.hget(`user:${user}`, 'sid');
      console.log('userSID: ', userSID);
      if (!activeSessions.includes(userSID)) {
        console.log('deleting ', userSID);
        await workerClient
        .multi()
        .zrem('users', user)
        .del(`user:${user}`)
        .del(`user:${user}:room`)
        .exec();
      } else {
        console.log('NOT deleting ', userSID);
      }
    }
  }
}

const cleanUp = async function(activeSessions) {
  console.log('Clean Up Isle NOBSC Messenger');
  await cleanUpRooms();
  await cleanUpChats();
  await cleanUpUsers(activeSessions);
}

module.exports = cleanUp;