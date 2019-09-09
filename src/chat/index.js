'use strict';

const pool = require('../lib/connections/mysqlPoolConnection');
const NOBSCUser = require('../mysql-access/User');
const NOBSCFriendship = require('../mysql-access/Friendship');

const { pubClient, subClient } = require('../lib/connections/redisConnection');
const MessengerChat = require('../redis-access/MessengerChat');
const MessengerRoom = require('../redis-access/MessengerRoom');
const MessengerUser = require('../redis-access/MessengerUser');

const User = (id, name) => ({id, user: name});

const Chat = (messageToAdd, room, user) => ({
  id: user.id + (new Date).getTime().toString(),
  ts: (new Date).getTime(),
  message: messageToAdd,
  room,
  user
});

const Whisper = (whisperToAdd, nameToWhisper, user) => ({
  id: user.id + (new Date).getTime().toString(),
  ts: (new Date).getTime(),
  whisper: whisperToAdd,
  to: nameToWhisper,
  user
});



const socketConnection = async function(socket) {
  const user = socket.request.userInfo.userId;
  const name = socket.request.userInfo.username;
  const nobscUser = new NOBSCUser(pool);
  const nobscFriendship = new NOBSCFriendship(pool);
  const messengerUser = new MessengerUser(pubClient);
  const messengerRoom = new MessengerRoom(pubClient, subClient);
  const messengerChat = new MessengerChat(pubClient);



  /*
  the one thing left to do here is
  no longer appear online for blocked users and deleted friends,
  the former we should definitely implement,
  the latter we may need really need
  */
  socket.on('GetOnline', async function() {
    const acceptedFriends = await nobscFriendship.viewAllMyAcceptedFriendships(user);
  
    if (acceptedFriends.length) {
      if (acceptedFriends.length > 1) {
        let friendsOnline = [];
        for (acceptedFriend of acceptedFriends) {
          const userIsConnected = await messengerUser.getUserSocketId(acceptedFriend.user_id);
          if (userIsConnected) {
            socket.broadcast.to(userIsConnected).emit('ShowOnline', name);
            friendsOnline.push(User(acceptedFriend.user_id, acceptedFriend.username));
          }
        }
        if (friendsOnline.length) socket.emit('GetOnline', friendsOnline);
      } else {
        let friendOnline = [];
        const userIsConnected = await messengerUser.getUserSocketId(acceptedFriends[0].user_id);
        if (userIsConnected) {
          socket.broadcast.to(userIsConnected).emit('ShowOnline', name);
          friendOnline.push(User(acceptedFriends[0].user_id, acceptedFriends[0].username));
          socket.emit('GetOnline', friendOnline);
        }
      }
    }
  });



  socket.on('GetUser', async function(room) {
    const users = await messengerRoom.getUsersInRoom(room);
    socket.emit('GetUser', users);
  });



  socket.on('AddChat', async function(messageToAdd) {
    const room = Object.keys(socket.rooms).filter(r => r !== socket.id);
    const chat = Chat(messageToAdd, room, User(user, name));

    await messengerChat.addChat(chat);
    socket.broadcast.to(room).emit('AddChat', chat);
    socket.emit('AddChat', chat);
  });



  socket.on('AddWhisper', async function(whisperToAdd, nameToWhisper) {
    const userExists = await nobscUser.getUserIdByUsername(nameToWhisper);

    if (userExists.length) {
      const blockedUsers = await nobscFriendship.viewAllMyBlockedUsers(userExists[0].user_id);
      const blockedByUser = blockedUsers.find(friend => friend.friend_id === user);

      if (!blockedByUser) {
        const userIsConnected = await messengerUser.getUserSocketId(userExists[0].user_id);

        if (userIsConnected) {
          const room = userIsConnected;
          const whisper = Whisper(whisperToAdd, nameToWhisper, User(user, name));
          socket.broadcast.to(room).emit('AddWhisper', whisper);
          socket.emit('AddWhisper', whisper);
        } else {
          socket.emit('FailedWhisper', 'User not found.');
        }
      } else {
        socket.emit('FailedWhisper', 'User not found.');
      }
    } else {
      socket.emit('FailedWhisper', 'User not found.');
    }
  });



  socket.on('AddRoom', async function(roomToAdd) {
    const currentRooms = socket.rooms;

    for (let room in currentRooms) {
      if (currentRooms[room] !== socket.id) {
        socket.leave(currentRooms[room]);
        messengerRoom.removeUserFromRoom(user, currentRooms[room]);
        socket.broadcast.to(currentRooms[room]).emit('RemoveUser', User(user, name));
      }
    }

    if (roomToAdd !== '') {
      socket.join(roomToAdd);

      await messengerRoom.addRoom(roomToAdd);
      await messengerRoom.addUserToRoom(user, roomToAdd);
      socket.broadcast.to(roomToAdd).emit('AddUser', User(user, name));

      const users = await messengerRoom.getUsersInRoom(roomToAdd);
      socket.emit('GetUser', users, roomToAdd);
    }
  });



  socket.on('disconnecting', async function() {
    const clonedSocket = {...socket};

    for (let room in clonedSocket.rooms) {
      if (room !== clonedSocket.id) {
        socket.broadcast.to(room).emit('RemoveUser', User(user, name));
        messengerRoom.removeUserFromRoom(user, room);
      }
    }

    const acceptedFriends = await nobscFriendship.viewAllMyAcceptedFriendships(user);

    if (acceptedFriends.length) {
      if (acceptedFriends.length > 1) {
        for (acceptedFriend of acceptedFriends) {
          const userIsConnected = await messengerUser.getUserSocketId(acceptedFriend.user_id);
          if (userIsConnected) socket.broadcast.to(userIsConnected).emit('ShowOffline', name);
        }
      } else {
        const userIsConnected = await messengerUser.getUserSocketId(acceptedFriends[0].user_id);
        if (userIsConnected) socket.broadcast.to(userIsConnected).emit('ShowOffline', name);
      }
    }

    await messengerUser.removeUser(user);
  });
};

module.exports = socketConnection;