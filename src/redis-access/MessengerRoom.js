class MessengerRoom {
  constructor(pubClient, subClient) {
    this.pubClient = pubClient;
    this.subClient = subClient;
    this.addRoom = this.addRoom.bind(this);
    this.getUsersInRoom = this.getUsersInRoom.bind(this);
    this.addUserToRoom = this.addUserToRoom.bind(this);
    this.removeUserFromRoom = this.removeUserFromRoom.bind(this);
  }

  async addRoom(room) {
    try {
      if (room !== '') await this.pubClient.zadd('rooms', Date.now(), room);
    } catch (err) {
      console.error(err);
    }
  };

  async getUsersInRoom(room) {
    try {
      const User = (userId, username, avatar) => ({
        userId,
        username,
        avatar
      });

      const data = await this.pubClient.zrange(`rooms:${room}`, 0, -1);
      
      const pubClient = this.pubClient;
      let users = [];

      for (let userId of data){
        const userHash = await pubClient.hgetall(`user:${userId}`);
        users.push(User(userId, userHash.username, userHash.avatar));
      }

      return users;
    } catch (err) {
      console.error(err);
    }
  }
  
  async addUserToRoom(userId, room) {
    try {
      await this.pubClient
      .multi()
      .zadd(`rooms:${room}`, Date.now(), userId)
      .set(`user:${userId}:room`, room)
      .exec();
    } catch (err) {
      console.error(err);
    }
  }
  
  async removeUserFromRoom(userId, room) {
    try {
      await this.pubClient
      .multi()
      .zrem(`rooms:${room}`, userId)
      .del(`user:${userId}:room`)
      .exec();
    } catch (err) {
      console.error(err);
    }
  };
}

module.exports = MessengerRoom;