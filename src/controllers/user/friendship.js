const pool = require('../../lib/connections/mysqlPoolConnection');
const User = require('../../mysql-access/User');
const Friendship = require('../../mysql-access/Friendship');

// WARNING: DO NOT RETURN user_id TO FRONT END !!!!!

const userFriendshipController = {
  viewAllMyFriendships: async function(req, res, next) {
    try {
      const type = (req.body.type) ? req.sanitize(req.body.type) : "none";
      const userId = req.session.userInfo.userId;
      const friendship = new Friendship(pool);
      let rows;
      if (type === "none") rows = await friendship.viewAllMyFriendships(userId);
      if (type === "accepted") rows = await friendship.viewAllMyAcceptedFriendships(userId);
      if (type === "pending") rows = await friendship.viewAllMyPendingFriendships(userId);
      if (type === "blocked") rows = await friendship.viewAllMyBlockedUsers(userId);
      res.send(rows);
      next();
    } catch(err) {
      next(err);
    }
  },
  createFriendship: async function(req, res, next) {
    try {
      const friendName = req.sanitize(req.body.friendName);
      const user = new User(pool);
      const [ friendExists ] = await user.getUserIdByUsername(friendName);
      let friendId;
      if (friendExists) friendId = friendExists[0].user_id;
      else return res.send('User not found.');
      const userId = req.session.userInfo.userId;
      const friendship = new Friendship(pool);
      await friendship.createFriendship(userId, friendId);
      res.send('Friendship request sent.');
      next();
    } catch(err) {
      next(err);
    }
  },
  acceptFriendship: async function(req, res, next) {
    try {
      const friendName = req.sanitize(req.body.friendName);
      const user = new User(pool);
      const [ friendExists ] = await user.getUserIdByUsername(friendName);
      let friendId;
      if (friendExists) friendId = friendExists[0].user_id;
      else return res.send('User not found.');
      const userId = req.session.userInfo.userId;
      const friendship = new Friendship(pool);
      await friendship.acceptFriendship(userId, friendId);
      res.send('Friendship request accepted.');
      next();
    } catch(err) {
      next(err);
    }
  },
  rejectFriendship: async function(req, res, next) {
    try {
      const friendName = req.sanitize(req.body.friendName);
      const user = new User(pool);
      const [ friendExists ] = await user.getUserIdByUsername(friendName);
      let friendId;
      if (friendExists) friendId = friendExists[0].user_id;
      else return res.send('User not found.');
      const userId = req.session.userInfo.userId;
      const friendship = new Friendship(pool);
      await friendship.rejectFriendship(userId, friendId);
      res.send('Friendship request rejected.');
      next();
    } catch(err) {
      next(err);
    }
  },
  deleteFriendship: async function(req, res, next) {
    try {
      const friendName = req.sanitize(req.body.friendName);
      const user = new User(pool);
      const [ friendExists ] = await user.getUserIdByUsername(friendName);
      let friendId;
      if (friendExists) friendId = friendExists[0].user_id;
      else return res.send('User not found.');
      const userId = req.session.userInfo.userId;
      const friendship = new Friendship(pool);
      await friendship.deleteFriendship(userId, friendId);
      res.send('Not friends. Maybe later.');
      next();
    } catch(err) {
      next(err);
    }
  },
  blockUser: async function(req, res, next) {
    try {

      next();
    } catch(err) {
      next(err);
    }
  },
  unblockUser: async function(req, res, next) {
    try {

      next();
    } catch(err) {
      next(err);
    }
  }
};

module.exports = userFriendshipController;