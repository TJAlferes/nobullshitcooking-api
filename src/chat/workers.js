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

            console.log('INSIDE! 1');
            console.log('INSIDE! 1');

            workerClient.zrangebyscore(
              'users',
              '-inf',
              ((new Date).getTime() - DELTA),
              function(err, users) {
                if (err !== null) {
                  console.log(err);
                } else {
                  console.log('INSIDE! 2');
                  console.log('INSIDE! 2');
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
    console.log('=====!=====!=====!=====!=====', err);
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
              console.log('INSIDE! 3');
              console.log('INSIDE! 3');
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
    console.log('=====!=====!=====!=====!=====', err);
  }
}

const cleanUp = async function() {
  console.log('Clean Up Isle NOBSC Messenger (START)');
  try {
    //workerClient.zadd('rooms', Date.now(), "testroom");
    await workerClient.set('testkey', 'heelllllooooothheeeerrrrreeeee');
    const thing1 = await workerClient.get('testkey');
    console.log('thing1: ', thing1);
  } catch (err) {
    console.log('=====!=====!=====!=====!=====', err);
  }

  let thing2;
  try {
    //await workerClient.zadd('rooms', Date.now(), "testroom");
    await workerClient.set('testkey2', 'heelllllooooobbaaabbbbbeeeeeeeee');
    thing2 = await workerClient.get('testkey2');
    console.log('thing2: ', thing2);
  } catch (err) {
    console.log('=====!=====!=====!=====!=====', err);
  }

  /*try {
    //await workerClient.zadd('rooms', Date.now(), "testroom");
    await workerClient.set('testkey3', 'heelllllooooofather');
    const thing3 = workerClient.get('testkey3');
    console.log(thing3);
  } catch (err) {
    console.log('=====!=====!=====!=====!=====', err);
  }*/
  //await cleanUpRooms();
  //await cleanUpChats();
  console.log('Clean Up Isle NOBSC Messenger (END)');
  return thing2;
}

module.exports = cleanUp;