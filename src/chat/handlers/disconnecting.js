async function disconnecting(
  socket,
  User,
  messengerRoom,
  messengerUser,
  nobscFriendship,
  userId,
  username,
  avatar,
  reason
) {
  const clonedSocket = {...socket};
  //console.log('disconnecting; reason: ', reason);
  
  for (let room in clonedSocket.rooms) {
    if (room !== clonedSocket.id) {
      socket.broadcast.to(room)
      .emit('RemoveUser', User(userId, username, avatar));
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
}

module.exports = disconnecting;