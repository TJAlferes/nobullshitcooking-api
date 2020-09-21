'use strict';

import { Pool } from 'mysql2/promise';
import { Socket } from 'socket.io';

import { pubClient, subClient } from '../lib/connections/redisConnection';  // to do
import { Friendship as NOBSCFriendship } from '../mysql-access/Friendship';
import { User as NOBSCUser } from '../mysql-access/User';
import { MessengerChat } from '../redis-access/MessengerChat';
import { MessengerRoom } from '../redis-access/MessengerRoom';
import { MessengerUser } from '../redis-access/MessengerUser';
import { addMessage } from './handlers/addMessage';
import { addRoom } from './handlers/addRoom';
import { addWhisper } from './handlers/addWhisper';
import { disconnecting } from './handlers/disconnecting';
import { getOnline } from './handlers/getOnline';
import { getUser } from './handlers/getUser';
import { rejoinRoom } from './handlers/rejoinRoom';

export function socketConnection(pool: Pool) {
  return async function(socket: Socket) {
    const { id, username, avatar } = socket.request.userInfo;
    const nobscUser = new NOBSCUser(pool);
    const nobscFriendship = new NOBSCFriendship(pool);
    const messengerUser = new MessengerUser(pubClient);  // to do
    const messengerRoom = new MessengerRoom(pubClient, subClient);  // to do
    const messengerChat = new MessengerChat(pubClient);  // to do

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
        id,
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
        id,
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
        id,
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
        id,
        username,
        avatar,
        socket,
        messengerRoom
      });
    });

    socket.on('RejoinRoom', async function(room: string) {
      await rejoinRoom({
        room,
        id,
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
        id,
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