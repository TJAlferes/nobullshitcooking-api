async function addChat(
  socket,
  ChatMessage,
  User,
  messengerChat,
  chatMessageText,
  userId,
  username,
  avatar
) {
  const room = Object.keys(socket.rooms).filter(r => r !== socket.id);

  const chat = ChatMessage(
    chatMessageText,
    room,
    User(userId, username, avatar)
  );

  await messengerChat.addChat(chat);
  
  socket.broadcast.to(room).emit('AddChat', chat);
  socket.emit('AddChat', chat);
};

module.exports = addChat;