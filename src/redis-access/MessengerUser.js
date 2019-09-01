class MessengerUser {
  constructor(client) {
    this.client = client;
    this.addUser = this.addUser.bind(this);
  }

  async addUser(user, name) {
    try {
      await this.client
      .multi()
      .hset(`user:${user}`, 'name', name)
      .zadd('users', Date.now(), user)
      .exec();
    } catch (err) {
      console.log(err);
      console.error(err);
    }
  }
}

module.exports = MessengerUser;