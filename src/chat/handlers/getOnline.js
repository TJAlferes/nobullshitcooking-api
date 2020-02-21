async function getOnline(
  socket,
  User,
  nobscFriendship,
  messengerUser,
  userId,
  username,
  avatar
) {
  console.log('getOnline called');
  const acceptedFriends = await nobscFriendship
  .viewAllMyAcceptedFriendships(userId);

  if (!acceptedFriends.length) return;

  let online = [];

  for (let acceptedFriend of acceptedFriends) {
    const onlineFriend = await messengerUser
    .getUserSocketId(acceptedFriend.user_id);
    
    if (!onlineFriend) return;

    socket.broadcast.to(onlineFriend)
    .emit('ShowOnline', User(userId, username, avatar));

    online.push(User(
      acceptedFriend.user_id,
      acceptedFriend.username,
      acceptedFriend.avatar
    ));
  }

  socket.emit('GetOnline', online);
};

module.exports = getOnline;