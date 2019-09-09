class MessengerUser {
  constructor(client) {
    this.client = client;
    this.getUserSocketId = this.getUserSocketId.bind(this);
    this.addUser = this.addUser.bind(this);
    this.removeUser = this.removeUser.bind(this);
  }

  async getUserSocketId(user) {
    try {
      const foundUserSocketId = await this.client.hget(`user:${user}`, 'socketid');
      return foundUserSocketId;
    } catch (err) {
      console.error(err);
    }
  }

  async addUser(user, name, avatar, sid, socketid) {
    try {
      await this.client
      .multi()
      .hset(`user:${user}`, 'name', name)
      .hset(`user:${user}`, 'avatar', avatar)
      .hset(`user:${user}`, 'sid', sid)
      .hset(`user:${user}`, 'socketid', socketid)
      .zadd('users', Date.now(), user)
      .exec();
    } catch (err) {
      console.error(err);
    }
  }

  async removeUser(user) {
    try {
      await this.client
      .multi()
      .zrem('users', user)
      .del(`user:${user}`)
      .exec()
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = MessengerUser;