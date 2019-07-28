class MessengerUser {
  constructor(client) {
    this.client = client;
    this.addUser = this.addUser.bind(this);
  }

  addUser(user, name, type) {
    this.client.multi()
    .hset('user:' + user, 'name', name)
    .hset('user:' + user, 'type', type)
    .zadd('users', Date.now(), user)
    .exec();
  }
}

module.exports = MessengerUser;