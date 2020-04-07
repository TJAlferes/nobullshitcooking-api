export class MessengerChat {
  constructor(client) {
    this.client = client;
    this.addChat = this.addChat.bind(this);
  }
  
  async addChat(chat) {
    try {
      await this.client
      .multi()
      .zadd(`rooms:${chat.room}:chats`, Date.now(), JSON.stringify(chat))
      .zadd('rooms', (new Date).getTime(), JSON.stringify(chat.room))
      .exec();
    } catch (err) {
      console.error(err);
    }
  };
}