'use strict';

import { Redis } from 'ioredis';

const INTERVAL = 60 * 60 * 1000 * 2; // 7200000 milliseconds = 2 hours
const DELTA = 60 * 60 * 1000 * 3;  // 10800000 milliseconds = 3 hours
const max = Date.now() - DELTA;

function cleanUpRooms(client: Redis) {
  client.zrangebyscore('rooms', '-inf', max, (err, rooms) => {
    if (err !== null) {
      console.log(err);
      return;
    }

    rooms.forEach(room => {
      client.multi()
        .zrem('rooms', room)
        .del(`rooms:${room}:users`)
        .del(`rooms:${room}:messages`)
        .exec();
    });
  });
}

function cleanUpUsers(client: Redis) {
  client.zrangebyscore('users', '-inf', max, (err, users) => {
    if (err !== null) {
      console.log(err);
      return;
    }

    users.forEach(id => {
      client.multi()
        .zrem('users', id)
        .del(`user:${id}`)
        .del(`user:${id}:room`)
        .exec();
    });
  });
}

// blocks? make async?
export function chatCleanUp(client: Redis) {
  function cleanUp() {
    console.log('START Chat Clean Up');
    cleanUpRooms(client);
    cleanUpUsers(client);
    console.log('END Chat Clean Up');
  }

  setInterval(cleanUp, INTERVAL);
  cleanUp();
}