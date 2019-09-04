'use strict';

const { workerClient } = require('../lib/connections/redisConnection');

const DELTA = 60 * 60 * 1000 * 3;

async function cleanUpRooms() {
  console.log('cleaning rooms');
  await workerClient.zrangebyscore('rooms', '-inf', ((new Date).getTime() - DELTA), function(err, rooms) {
    if (err !== null) {
      console.log(err);
    } else {
      rooms.forEach(function(room) {
        workerClient
        .multi()
        .zrem('rooms', room)
        .del(`rooms:${room}:chats`)
        .exec();
      });
    }
  });
}

async function cleanUpChats() {
  console.log('cleaning chats');
  await workerClient.zrange('rooms', 0, -1, function(err, rooms) {
    workerClient.zrangebyscore('rooms', '-inf', ((new Date).getTime() - DELTA), function(err, rooms) {
      if (err !== null) {
        console.log(err);
      } else {
        rooms.forEach(function(room) {
          workerClient.zremrangebyscore(`rooms:${room}:chats`, '-inf', ((new Date).getTime() - DELTA));
        });
      }
    });
  });
}

async function cleanUpUsers() {
  console.log('cleaning users');
  await workerClient.zrangebyscore('users', '-inf', ((new Date).getTime() - DELTA), function(err, users) {
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
  });
}

const cleanUp = async function() {
  await cleanUpRooms();
  await cleanUpChats();
  await cleanUpUsers();
  console.log('Clean Up Isle NOBSC Messenger');
}

module.exports = cleanUp;