class MessengerUser {
  constructor(client) {
    this.client = client;
    this.addUser = this.addUser.bind(this);
  }

  async addUser(user, name, sid) {
    try {
      await this.client
      .multi()
      .hset(`user:${user}`, 'name', name)
      .hset(`user:${user}`, 'sid', sid)
      .zadd('users', Date.now(), user)
      .exec();
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = MessengerUser;