'use strict';

import { Redis } from 'ioredis';

const DELTA = 60 * 60 * 1000 * 2;  // 2 hours

async function cleanUpRooms(workerClient: Redis) {
  await workerClient.zrangebyscore(
    'rooms',
    '-inf',
    ((new Date).getTime() - DELTA),
    function(err, rooms) {
      if (err !== null) {
        console.log(err);
        return;
      }

      rooms.forEach(function(room) {
        workerClient
        .multi()
        .zrem('rooms', room)
        .del(`rooms:${room}:messages`)
        .exec();

        workerClient.zrangebyscore(
          'users',
          '-inf',
          ((new Date).getTime() - DELTA),
          function(err, users) {
            if (err !== null) {
              console.log(err);
              return;
            }

            users.forEach(function(user) {
              workerClient.zrem(`rooms:${room}`, user);
            });
          }
        );
      });
    }
  );
}

// rooms?
async function cleanUpChats(workerClient: Redis) {
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
            return;
          }

          rooms.forEach(function(room) {
            workerClient.zremrangebyscore(
              `rooms:${room}:messages`,
              '-inf',
              ((new Date).getTime() - DELTA)
            );
          });
        }
      );
    }
  );
}

export async function cleanUp(workerClient: Redis) {
  console.log('Clean Up Isle NOBSC Messenger (START)');
  await cleanUpRooms(workerClient);
  await cleanUpChats(workerClient);
  console.log('Clean Up Isle NOBSC Messenger (END)');
}