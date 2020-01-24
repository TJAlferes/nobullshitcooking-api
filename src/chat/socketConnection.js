'use strict';

const pool = require('../lib/connections/mysqlPoolConnection');
const NOBSCUser = require('../mysql-access/User');
const NOBSCFriendship = require('../mysql-access/Friendship');

const { pubClient, subClient } = require('../lib/connections/redisConnection');
const MessengerChat = require('../redis-access/MessengerChat');
const MessengerRoom = require('../redis-access/MessengerRoom');
const MessengerUser = require('../redis-access/MessengerUser');

const User = (userId, username, avatar) => ({
  userId,
  username,
  avatar
});

const ChatMessage = (chatMessageText, room, user) => ({
  chatMessageId: user.userId + (new Date).getTime().toString(),
  chatMessageText,
  room,
  user
});

const Whisper = (whisperText, to, user) => ({
  whisperId: user.userId + (new Date).getTime().toString(),
  whisperText,
  to,
  user
});



const socketConnection = async function(socket) {
  const userId = socket.request.userInfo.userId;
  const username = socket.request.userInfo.username;
  const avatar = socket.request.userInfo.avatar;

  // move these up?
  const nobscUser = new NOBSCUser(pool);
  const nobscFriendship = new NOBSCFriendship(pool);
  const messengerUser = new MessengerUser(pubClient);
  const messengerRoom = new MessengerRoom(pubClient, subClient);
  const messengerChat = new MessengerChat(pubClient);



  // +=========+
  // |  Users  |
  // +=========+



  //the one thing left to do here is
  //no longer appear online for blocked users and deleted friends during that same session,
  //the former we should definitely implement,
  //the latter we may need really need
  // rename
  socket.on('GetOnline', async function() {
    const acceptedFriends = await nobscFriendship.viewAllMyAcceptedFriendships(userId);
  
    if (acceptedFriends.length) {
      if (acceptedFriends.length > 1) {

        let friendsOnline = [];

        for (let acceptedFriend of acceptedFriends) {
          const userIsConnected = await messengerUser
          .getUserSocketId(acceptedFriend.user_id);

          if (userIsConnected) {
            socket.broadcast.to(userIsConnected)
            .emit('ShowOnline', User(userId, username, avatar));

            friendsOnline.push(User(
              acceptedFriend.user_id,
              acceptedFriend.username,
              acceptedFriend.avatar
            ));
          }
        }

        if (friendsOnline.length) socket.emit('GetOnline', friendsOnline);

      } else {

        let friendOnline = [];
        const userIsConnected = await messengerUser
        .getUserSocketId(acceptedFriends[0].user_id);

        if (userIsConnected) {
          socket.broadcast.to(userIsConnected)
          .emit('ShowOnline', User(userId, username, avatar));

          friendOnline.push(User(
            acceptedFriends[0].user_id,
            acceptedFriends[0].username,
            acceptedFriends[0].avatar
          ));

          socket.emit('GetOnline', friendOnline);
        }

      }
    }
  });



  socket.on('GetUser', async function(room) {
    const users = await messengerRoom.getUsersInRoom(room);
    socket.emit('GetUser', users);
  });



  // +============+
  // |  Messages  |
  // +============+



  socket.on('AddChat', async function(chatMessageText) {
    const room = Object.keys(socket.rooms).filter(r => r !== socket.id);

    const chat = ChatMessage(
      chatMessageText,
      room,
      User(userId, username, avatar)
    );

    await messengerChat.addChat(chat);
    socket.broadcast.to(room).emit('AddChat', chat);
    socket.emit('AddChat', chat);
  });



  socket.on('AddWhisper', async function(whisperText, to) {
    const userExists = await nobscUser.getUserIdByUsername(to);

    if (userExists.length) {

      const blockedUsers = await nobscFriendship
      .viewAllMyBlockedUsers(userExists[0].user_id);

      const blockedByUser = blockedUsers
      .find(friend => friend.user_id === userId);

      if (!blockedByUser) {

        const userIsConnected = await messengerUser
        .getUserSocketId(userExists[0].user_id);

        if (userIsConnected) {
          const room = userIsConnected;

          const whisper = Whisper(
            whisperText,
            to,
            User(userId, username, avatar)
          );

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



  // +=========+
  // |  Rooms  |
  // +=========+



  socket.on('AddRoom', async function(room) {
    const currentRooms = socket.rooms;

    for (let currentRoom in currentRooms) {
      if (currentRooms[currentRoom] !== socket.id) {
        socket.leave(currentRooms[currentRoom]);

        messengerRoom.removeUserFromRoom(userId, currentRooms[currentRoom]);

        socket.broadcast.to(currentRooms[currentRoom])
        .emit(
          'RemoveUser',
          User(userId, username, avatar)
        );
      }
    }

    if (room !== '') {
      socket.join(room);

      await messengerRoom.addRoom(room);
      await messengerRoom.addUserToRoom(userId, room);

      socket.broadcast.to(room)
      .emit(
        'AddUser',
        User(userId, username, avatar)
      );

      const users = await messengerRoom.getUsersInRoom(room);

      socket.emit('GetUser', users, room);
    }
  });



  socket.on('RejoinRoom', async function(room) {
    if (room !== '') {
      socket.join(room);

      await messengerRoom.addRoom(room);
      await messengerRoom.addUserToRoom(userId, room);

      socket.broadcast.to(room)
      .emit(
        'AddUser',
        User(userId, username, avatar)
      );

      const users = await messengerRoom.getUsersInRoom(room);

      socket.emit('RegetUser', users, room);
    }
  });



  // +===================+
  // |  SocketIO events  |
  // +===================+



  socket.on('error', (error) => console.log('error: ', error));



  socket.on('disconnecting', async function(reason) {
    const clonedSocket = {...socket};
    //console.log('disconnecting; reason: ', reason);
    
    for (let room in clonedSocket.rooms) {
      if (room !== clonedSocket.id) {
        socket.broadcast.to(room)
        .emit(
          'RemoveUser',
          User(userId, username, avatar)
        );

        messengerRoom.removeUserFromRoom(userId, room);
      }
    }

    const acceptedFriends = await nobscFriendship
    .viewAllMyAcceptedFriendships(userId);

    if (acceptedFriends.length) {
      if (acceptedFriends.length > 1) {

        for (let acceptedFriend of acceptedFriends) {
          const userIsConnected = await messengerUser
          .getUserSocketId(acceptedFriend.user_id);

          if (userIsConnected) {
            socket.broadcast.to(userIsConnected)
            .emit('ShowOffline', User(userId, username, avatar));
          }
        }

      } else {

        const userIsConnected = await messengerUser
        .getUserSocketId(acceptedFriends[0].user_id);

        if (userIsConnected) {
          socket.broadcast.to(userIsConnected)
          .emit('ShowOffline', User(userId, username, avatar));
        }

      }
    }

    await messengerUser.removeUser(userId);
  });



  /*socket.on('disconnect', async function(reason) {
    console.log('disconnect; reason: ', reason);
  });*/
};

module.exports = socketConnection;