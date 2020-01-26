async function addWhisper(
  socket,
  Whisper,
  User,
  nobscUser,
  nobscFriendship,
  messengerUser,
  userId,
  username,
  avatar,
  whisperText,
  to
) {
  const userExists = await nobscUser.getUserIdByUsername(to);
  if (!userExists.length) {
    return socket.emit('FailedWhisper', 'User not found.');
  }

  const blockedUsers = await nobscFriendship
  .viewAllMyBlockedUsers(userExists[0].user_id);
  const blockedByUser = blockedUsers
  .find(friend => friend.user_id === userId);
  if (!blockedByUser) return socket.emit('FailedWhisper', 'User not found.');

  const userIsConnected = await messengerUser
  .getUserSocketId(userExists[0].user_id);
  if (!userIsConnected) return socket.emit('FailedWhisper', 'User not found.');

  const room = userIsConnected;
  const whisper = Whisper(
    whisperText,
    to,
    User(userId, username, avatar)
  );
  socket.broadcast.to(room).emit('AddWhisper', whisper);
  socket.emit('AddWhisper', whisper);
};

module.exports = addWhisper;