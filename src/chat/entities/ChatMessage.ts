const ChatMessage = (chatMessageText, room, user) => ({
  chatMessageId: user.userId + (new Date).getTime().toString(),
  chatMessageText,
  room,
  user
});

module.exports = ChatMessage;