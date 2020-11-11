'use strict';

import { Pool } from 'mysql2/promise';
import { Socket } from 'socket.io';  // TO DO: replace uws with eiows?

import { Friendship as NOBSCFriendship } from '../access/mysql/Friendship';
import { User as NOBSCUser } from '../access/mysql/User';
import { MessengerChat } from '../access/redis/MessengerChat';
import { MessengerRoom } from '../access/redis/MessengerRoom';
import { MessengerUser } from '../access/redis/MessengerUser';
import { RedisClients } from '../app';
import { addMessage } from './handlers/addMessage';
import { addRoom } from './handlers/addRoom';
import { addWhisper } from './handlers/addWhisper';
import { disconnecting } from './handlers/disconnecting';
import { getOnline } from './handlers/getOnline';
import { getUser } from './handlers/getUser';
import { rejoinRoom } from './handlers/rejoinRoom';

export function socketConnection(pool: Pool, redisClients: RedisClients) {
  return async function(socket: Socket) {
    //const { id, username, avatar } = socket.request.userInfo;  // OLD, read-only now
    // 3 possible NEW:
    //const { username, avatar } = socket.handshake.headers.userInfo;
    //const { username, avatar } = socket.handshake.query.userInfo;
    //const { username, avatar } = socket.request.headers.userInfo;  // and just change to separate strings?
    const { pubClient, subClient } = redisClients;
    const nobscUser = new NOBSCUser(pool);
    const nobscFriendship = new NOBSCFriendship(pool);
    const messengerUser = new MessengerUser(pubClient);
    const messengerRoom = new MessengerRoom(pubClient, subClient);
    const messengerChat = new MessengerChat(pubClient);

    /*
    
    Users

    */

    // TO DO:
    // no longer appear online
    // for users blocked and friends deleted
    // during that same session
    
    // rename
    socket.on('GetOnline', async function() {
      await getOnline({
        username,
        avatar,
        socket,
        messengerUser,
        nobscFriendship
      });
    });

    socket.on('GetUser', async function(room: string) {
      await getUser({room, socket, messengerRoom});
    });

    /*
    
    Messages

    */

    socket.on('AddMessage', async function(text: string) {
      await addMessage({
        text,
        username,
        avatar,
        socket,
        messengerChat
      });
    });

    socket.on('AddWhisper', async function(text: string, to: string) {
      await addWhisper({
        text,
        to,
        username,
        avatar,
        socket,
        messengerUser,
        nobscFriendship,
        nobscUser
      });
    });

    /*
    
    Rooms

    */

    socket.on('AddRoom', async function(room: string) {
      await addRoom({
        room,
        username,
        avatar,
        socket,
        messengerRoom
      });
    });

    socket.on('RejoinRoom', async function(room: string) {
      await rejoinRoom({
        room,
        username,
        avatar,
        socket,
        messengerRoom
      });
    });

    /*
    
    SocketIO events

    */

    socket.on('error', (error: Error) => console.log('error: ', error));

    socket.on('disconnecting', async function(reason: any) {
      await disconnecting({
        reason,
        username,
        avatar,
        socket,
        messengerRoom,
        messengerUser,
        nobscFriendship
      });
    });

    /*socket.on('disconnect', function(reason) {
      console.log('disconnect; reason: ', reason);
    });*/
  }
}