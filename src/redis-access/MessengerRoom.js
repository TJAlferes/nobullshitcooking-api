class MessengerRoom {
  constructor(client) {
    this.client = client;
    this.getRooms = this.getRooms.bind(this);
    this.addRoom = this.addRoom.bind(this);

    this.getUsersInRoom = this.getUsersInRoom.bind(this);
    this.addUserToRoom = this.addUserToRoom.bind(this);
    this.removeUserFromRoom = this.removeUserFromRoom.bind(this);
  }

  getRooms(cb){
    this.client.zrevrangebyscore('rooms', '+inf', '-inf', function(err, data) {
      return cb(data);
    });
  };
  
  addRoom(room) {
    if (room !== '') this.client.zadd('rooms', Date.now(), room);
  };



  /*getUsersinRoom(room){
    return Promise(function(resolve, reject) {
      this.client.zrange('rooms:' + room, 0, -1, function(err, data) {
        var users = [];
        var loopsleft = data.length;
        data.forEach(function(u){
          this.client.hgetall('user:' + u, function(err, userHash){
            users.push(models.User(u, userHash.name, userHash.type));
            loopsleft--;
            if (loopsleft === 0) resolve(users);
          });
        });
      });
    });
  };*/
  
  async getUsersInRoom(room) {
    const User = (id, name) => ({id, user: name});  // change
    let users = [];
    await this.client.zrange(`rooms:${room}`, 0, -1, function(err, data) {
      data.forEach(function(u) {
        this.client.hgetall(`user:${u}`, function(err, userHash){
          users.push(User(u, userHash.name));
        });
      });
    });
    return users;
  }
  
  addUserToRoom(user, room) {
    this.client
    .multi()
    .zadd(`rooms:${room}`, Date.now(), user)
    .zadd('users', Date.now(), user)
    .zadd('rooms', Date.now(), room)
    .set(`user:${user}:room`, room)
    .exec();
  }
  
  removeUserFromRoom(user, room) {
    this.client
    .multi()
    .zrem(`rooms:${room}`, user)
    .del(`user:${user}:room`)
    .exec();
  };
}

module.exports = MessengerRoom;