'use strict';

const { pubClient, subClient } = require('../lib/connections/redisConnection');

const DELTA = 60 * 60 * 1000 * 3;
const INTERVAL = 60 * 60 * 1000 * 2;



// TEST IF YOU CAN INTERWEAVE CLIENTS LIKE THIS



async function cleanUpRooms() {
  await subClient.zrangebyscore('rooms', '-inf', ((new Date).getTime() - DELTA), function(err, rooms) {
    if (err !== null) {
      console.log(err);
    } else {
      rooms.forEach(function(room) {
        pubClient
        .multi()
        .zrem('rooms', room)
        .del(`rooms:${room}:chats`)
        .exec();
      });
    }
  });
}

async function cleanUpChats() {
  await subClient.zrange('rooms', 0, -1, function(err, rooms) {
    subClient.zrangebyscore('rooms', '-inf', ((new Date).getTime() - DELTA), function(err, rooms) {
      if (err !== null) {
        console.log(err);
      } else {
        rooms.forEach(function(room) {
          pubClient.zremrangebyscore(`rooms:${room}:chats`, '-inf', ((new Date).getTime() - DELTA));
        });
      }
    });
  });
}

async function cleanUpUsers() {
  await subClient.zrangebyscore('users', '-inf', ((new Date).getTime() - DELTA), function(err, users) {
    if (err !== null) {
      console.log(err);
    } else {
      users.forEach(function(room) {
        pubClient
        .multi()
        .zrem('users', user)
        .del(`user:${user}`)
        .del(`user:${user}:room`)
        .exec();
      });
    }
  });
}

async function cleanUp() {
  await cleanUpRooms();
  await cleanUpChats();
  await cleanUpUsers();
  console.log('Clean Up Isle Messenger');
}

setInterval(cleanUp, INTERVAL);
cleanUp();