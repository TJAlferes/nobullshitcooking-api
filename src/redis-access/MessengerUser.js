class MessengerUser {
  constructor(client) {
    this.client = client;
    this.addUser = this.addUser.bind(this);
  }

  addUser(user, name) {
    this.client
    .multi()
    .hset(`user:${user}`, 'name', name)
    .zadd('users', Date.now(), user)
    .exec();
  }
}

module.exports = MessengerUser;