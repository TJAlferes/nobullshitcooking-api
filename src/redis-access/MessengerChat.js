class MessengerChat {
  constructor(client) {
    this.client = client;
    this.getChat = this.getChat.bind(this);
    this.addChat = this.addChat.bind(this);
  }

  async getChat(room, cb){
    try {
      await this.client.zrange(`rooms:${room}:chats`, 0, -1, function(err, chats) {
        cb(chats);
      });
    } catch (err) {
      console.error(err);
    }
  };
  
  async addChat(chat) {
    try {
      await this.client
      .multi()
      .zadd(`rooms:'${chat.room}:chats`, Date.now(), JSON.stringify(chat))
      .zadd('users', (new Date).getTime(), chat.user.id)
      .zadd('rooms', (new Date).getTime(), chat.room)
      .exec();
    } catch (err) {
      console.error(err);
    }
  };
}

module.exports = MessengerChat;