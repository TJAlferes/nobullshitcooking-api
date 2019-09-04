class MessengerRoom {
  constructor(pubClient, subClient) {
    this.pubClient = pubClient;
    this.subClient = subClient;
    this.getRooms = this.getRooms.bind(this);
    this.addRoom = this.addRoom.bind(this);

    this.getUsersInRoom = this.getUsersInRoom.bind(this);
    this.addUserToRoom = this.addUserToRoom.bind(this);
    this.removeUserFromRoom = this.removeUserFromRoom.bind(this);
  }

  async getRooms(cb){
    try {
      await this.subClient.zrevrangebyscore('rooms', '+inf', '-inf');  // pubClient instead?
    } catch (err) {
      console.error(err);
    }
  };
  
  async addRoom(room) {
    try {
      if (room !== '') {
        await this.pubClient.zadd('rooms', Date.now(), room);
      }
    } catch (err) {
      console.error(err);
    }
  };



  async getUsersInRoom(room) {
    try {
      const User = (id, name) => ({id, user: name});  // change (just need the username, not the userId!)
      let users = [];
      const data = await this.pubClient.zrange(`rooms:${room}`, 0, -1);
      const pubClient = this.pubClient;
      for (let u of data){
        const userHash = await pubClient.hgetall(`user:${u}`);
        users.push(User(u, userHash.name));
      }
      return users;
    } catch (err) {
      console.error(err);
    }
  }
  
  async addUserToRoom(user, room) {
    try {
      await this.pubClient
      .multi()
      .zadd(`rooms:${room}`, Date.now(), user)
      .zadd('users', Date.now(), user)
      .zadd('rooms', Date.now(), room)
      .set(`user:${user}:room`, room)
      .exec();
    } catch (err) {
      console.error(err);
    }
  }
  
  async removeUserFromRoom(user, room) {
    try {
      await this.pubClient
      .multi()
      .zrem(`rooms:${room}`, user)
      .del(`user:${user}:room`)
      .exec();
    } catch (err) {
      console.error(err);
    }
  };
}

module.exports = MessengerRoom;