const pool = require('../data-access/dbPoolConnection');
const Friendship = require('../data-access/Friendship');
const User = require('../data-access/user/User');

// WARNING: DO NOT RETURN user_id TO FRONT END !!!!!

const friendshipController = {
  viewFriendshipsByUser: async function(req, res, next) {
    try {
      const type = (req.body.type) ? req.sanitize(req.body.type) : "none";
      const userId = req.session.userInfo.userId;
      const friendship = new Friendship(pool);
      let rows;
      if (type === "none") rows = await friendship.viewFriendshipsByUser(userId);
      if (type === "accepted") rows = await friendship.viewAcceptedFriendshipsByUser(userId);
      if (type === "pending") rows = await friendship.viewPendingFriendshipsByUser(userId);
      if (type === "blocked") rows = await friendship.viewBlockedUsersByUser(userId);
      res.send(rows);
      next();
    } catch(err) {
      next(err);
    }
  },
  createFriendship: async function(req, res, next) {
    try {
      const friendName = req.sanitize(req.body.friendName);  // also validate with superstruct for string?
      const user = new User(pool);
      const [ friendExists ] = user.getUserByName(friendName);
      let friendId;
      if (friendExists) friendId = friendExists[0].user_id;
      const userId = req.session.userInfo.userId;
      const friendship = new Friendship(pool);
      const [ row ] = await friendship.createFriendship(userId, friendId);
      // error conditional here?
      res.send('Friendship request sent.');
      next();
    } catch(err) {
      next(err);
    }
  },
  acceptFriendship: async function(req, res, next) {
    try {
      const friendName = req.sanitize(req.body.friendName);  // also validate with superstruct for string?
      const user = new User(pool);
      const [ friendExists ] = user.getUserByName(friendName);
      let friendId;
      if (friendExists) friendId = friendExists[0].user_id;
      const userId = req.session.userInfo.userId;
      const friendship = new Friendship(pool);
      const [ row ] = await friendship.acceptFriendship(userId, friendId);
      // error conditional here?
      res.send('Friendship request accepted.');
      next();
    } catch(err) {
      next(err);
    }
  },
  deleteFriendship: async function(req, res, next) {
    try {
      const friendName = req.sanitize(req.body.friendName);  // also validate with superstruct for string?
      const user = new User(pool);
      const [ friendExists ] = user.getUserByName(friendName);
      let friendId;
      if (friendExists) friendId = friendExists[0].user_id;
      const userId = req.session.userInfo.userId;
      const friendship = new Friendship(pool);
      const [ row ] = await friendship.deleteFriendship(userId, friendId);
      // error conditional here?
      res.send('Not friends. Maybe later.');
      next();
    } catch(err) {
      next(err);
    }
  }
};

module.exports = friendshipController;