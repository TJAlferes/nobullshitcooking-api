'use strict';

import { Pool } from 'mysql2/promise';
import { Socket } from 'socket.io';  // TO DO: replace uws with eiows?

import { Friendship as NOBSCFriendship } from '../access/mysql/Friendship';
import { User as NOBSCUser } from '../access/mysql/User';
import { ChatMessage } from '../access/redis/ChatMessage';
import { ChatRoom } from '../access/redis/ChatRoom';
import { ChatUser } from '../access/redis/ChatUser';
import { RedisClients } from '../app';
import { addPublicMessage } from './handlers/addPublicMessage';
import { addRoom } from './handlers/addRoom';
import { addPrivateMessage } from './handlers/addPrivateMessage';
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
    const chatUser = new ChatUser(pubClient);
    const chatRoom = new ChatRoom(pubClient, subClient);
    const chatMessage = new ChatMessage(pubClient);

    /*
    
    Users

    */

    // TO DO:
    // no longer appear online
    // for users blocked and friends deleted
    // during that same session
    
    // rename
    socket.on('GetOnline', async function() {
      await getOnline({username, socket, chatUser, nobscFriendship});
    });

    socket.on('GetUser', async function(room: string) {
      await getUser({room, socket, chatRoom});
    });

    /*
    
    Messages

    */

    socket.on('AddMessage', async function(text: string) {
      await addPublicMessage({username, text, socket, chatMessage});
    });

    socket.on('AddWhisper', async function(text: string, to: string) {
      await addPrivateMessage({
        to,
        username,
        text,
        socket,
        chatUser,
        nobscFriendship,
        nobscUser
      });
    });

    /*
    
    Rooms

    */

    socket.on('AddRoom', async function(room: string) {
      await addRoom({room, username, socket, chatRoom});
    });

    socket.on('RejoinRoom', async function(room: string) {
      await rejoinRoom({room, username, socket, chatRoom});
    });

    /*
    
    SocketIO events

    */

    socket.on('error', (error: Error) => console.log('error: ', error));

    socket.on('disconnecting', async function(reason: any) {
      await disconnecting({
        reason,
        username,
        socket,
        chatRoom,
        chatUser,
        nobscFriendship
      });
    });

    /*socket.on('disconnect', function(reason) {
      console.log('disconnect; reason: ', reason);
    });*/
  }
}