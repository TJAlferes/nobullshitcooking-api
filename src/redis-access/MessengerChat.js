class MessengerChat {
  constructor(client) {
    this.client = client;
    this.getChat = this.getChat.bind(this);
    this.addChat = this.addChat.bind(this);
  }

  getChat(room, cb){
    this.client.zrange(`rooms:${room}:chats`, 0, -1, function(err, chats) {
      cb(chats);
    });
  };
  
  addChat(chat) {
    this.client
    .multi()
    .zadd(`rooms:'${chat.room}:chats`, Date.now(), JSON.stringify(chat))
    .zadd('users', (new Date).getTime(), chat.user.id)
    .zadd('rooms', (new Date).getTime(), chat.room)
    .exec();
  };
}

module.exports = MessengerChat;