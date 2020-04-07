export class MessengerUser {
  constructor(client) {
    this.client = client;
    this.getUserSocketId = this.getUserSocketId.bind(this);
    this.addUser = this.addUser.bind(this);
    this.removeUser = this.removeUser.bind(this);
  }

  async getUserSocketId(userId) {
    try {
      const foundUserSocketId = await this.client
      .hget(`user:${userId}`, 'socketid');
      return foundUserSocketId;
    } catch (err) {
      console.error(err);
    }
  }

  async addUser(userId, username, avatar, sid, socketid) {
    try {
      await this.client
      .multi()
      .hset(`user:${userId}`, 'username', username)
      .hset(`user:${userId}`, 'avatar', avatar)
      .hset(`user:${userId}`, 'sid', sid)
      .hset(`user:${userId}`, 'socketid', socketid)
      .zadd('users', Date.now(), userId)
      .exec();
    } catch (err) {
      console.error(err);
    }
  }

  async removeUser(userId) {
    try {
      await this.client
      .multi()
      .zrem('users', userId)
      .del(`user:${userId}`)
      .exec()
    } catch (err) {
      console.error(err);
    }
  }
}