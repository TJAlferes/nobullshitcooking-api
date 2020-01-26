const getOnline = async function(
  socket,
  User,
  nobscFriendship,
  messengerUser,
  userId,
  username,
  avatar
) {
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
};

module.exports = getOnline;