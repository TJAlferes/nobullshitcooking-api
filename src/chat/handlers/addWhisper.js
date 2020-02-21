async function addWhisper(
  socket,
  Whisper,
  User,
  nobscUser,
  nobscFriendship,
  messengerUser,
  whisperText,
  to,
  userId,
  username,
  avatar
) {
  const userExists = await nobscUser.getUserIdByUsername(to);

  if (!userExists.length) {
    return socket.emit('FailedWhisper', 'User not found.');
  }



  const blockedUsers = await nobscFriendship
  .viewAllMyBlockedUsers(userExists[0].user_id);

  const blockedByUser = blockedUsers
  .find(friend => friend.user_id === userId);

  if (blockedByUser) return socket.emit('FailedWhisper', 'User not found.');



  const onlineUser = await messengerUser
  .getUserSocketId(userExists[0].user_id);

  if (!onlineUser) return socket.emit('FailedWhisper', 'User not found.');



  const whisper = Whisper(
    whisperText,
    to,
    User(userId, username, avatar)
  );

  socket.broadcast.to(onlineUser).emit('AddWhisper', whisper);
  socket.emit('AddWhisper', whisper);
};

module.exports = addWhisper;