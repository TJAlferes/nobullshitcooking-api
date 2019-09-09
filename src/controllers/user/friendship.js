const pool = require('../../lib/connections/mysqlPoolConnection');
const User = require('../../mysql-access/User');
const Friendship = require('../../mysql-access/Friendship');
const validFriendshipEntity = require('../../lib/validations/friendship/friendshipEntity');

// WARNING: DO NOT RETURN user_id TO FRONT END !!!!! (why not?)

const userFriendshipController = {
  viewAllMyFriendships: async function(req, res, next) {  // JUST DO TYPE FILTERING ON FRONT END
    try {
      //const type = (req.body.type) ? req.sanitize(req.body.type) : "none";
      const userId = req.session.userInfo.userId;
      const friendship = new Friendship(pool);
      const rows = await friendship.viewAllMyFriendships(userId);
      //if (type === "accepted") rows = await friendship.viewAllMyAcceptedFriendships(userId);
      //if (type === "pending") rows = await friendship.viewAllMyPendingFriendships(userId);
      //if (type === "blocked") rows = await friendship.viewAllMyBlockedUsers(userId);
      res.send(rows);
      next();
    } catch(err) {
      next(err);
    }
  },
  createFriendship: async function(req, res) {
    const friendName = req.sanitize(req.body.friendName);
    const user = new User(pool);
    const friendExists = await user.getUserIdByUsername(friendName);
    let friendId;
    if (friendExists.length) {
      friendId = friendExists[0].user_id;
    } else {
      return res.send({message: 'User not found.'});
    }
    const userId = req.session.userInfo.userId;
    const status = "pending";
    const friendshipToCreate = validFriendshipEntity({userId, friendId, status});
    const friendship = new Friendship(pool);

    const blockedBy = await friendship.checkIfBlockedBy(friendId);
    if (blockedBy.length) return res.send({message: 'User not found.'});

    const friendshipExists = await friendship.getFriendshipByFriendId(friendId);
    if (friendshipExists.length) {
      if (friendshipExists[0].status = "pending") return res.send({message: 'Friendship request already sent.'});
      if (friendshipExists[0].status = "accepted") return res.send({message: 'Already friends.'});
      if (friendshipExists[0].status = "blocked") return res.send({message: 'User blocked. First unblock.'});
    }

    await friendship.createFriendship(friendshipToCreate);
    res.send({message: 'Friendship request sent.'});
  },
  acceptFriendship: async function(req, res, next) {
    try {
      const friendName = req.sanitize(req.body.friendName);
      const user = new User(pool);
      const friendExists = await user.getUserIdByUsername(friendName);
      let friendId;
      if (friendExists.length) {
        friendId = friendExists[0].user_id;
      } else {
        res.send({message: 'User not found.'});
        return next();
      }
      const userId = req.session.userInfo.userId;
      const friendship = new Friendship(pool);
      await friendship.acceptFriendship(userId, friendId);
      res.send({message: 'Friendship request accepted.'});
      next();
    } catch(err) {
      next(err);
    }
  },
  rejectFriendship: async function(req, res, next) {
    try {
      const friendName = req.sanitize(req.body.friendName);
      const user = new User(pool);
      const friendExists = await user.getUserIdByUsername(friendName);
      let friendId;
      if (friendExists.length) {
        friendId = friendExists[0].user_id;
      } else {
        res.send({message: 'User not found.'});
        return next();
      }
      const userId = req.session.userInfo.userId;
      const friendship = new Friendship(pool);
      await friendship.rejectFriendship(userId, friendId);
      res.send({message: 'Friendship request rejected.'});
      next();
    } catch(err) {
      next(err);
    }
  },
  deleteFriendship: async function(req, res, next) {
    try {
      const friendName = req.sanitize(req.body.friendName);
      const user = new User(pool);
      const friendExists = await user.getUserIdByUsername(friendName);
      let friendId;
      if (friendExists.length) {
        friendId = friendExists[0].user_id;
      } else {
        res.send({message: 'User not found.'});
        return next();
      }
      const userId = req.session.userInfo.userId;
      const friendship = new Friendship(pool);
      await friendship.deleteFriendship(userId, friendId);
      res.send({message: 'No longer friends. Maybe again later.'});
      next();
    } catch(err) {
      next(err);
    }
  },
  blockUser: async function(req, res, next) {
    try {
      const friendName = req.sanitize(req.body.friendName);
      const user = new User(pool);
      const friendExists = await user.getUserIdByUsername(friendName);
      let friendId;
      if (friendExists.length) {
        friendId = friendExists[0].user_id;
      } else {
        res.send({message: 'User not found.'});
        return next();
      }
      const userId = req.session.userInfo.userId;
      const friendship = new Friendship(pool);
      await friendship.blockUser(userId, friendId);
      res.send({message: 'User blocked.'});
      next();
    } catch(err) {
      next(err);
    }
  },
  unblockUser: async function(req, res, next) {
    try {
      const friendName = req.sanitize(req.body.friendName);
      const user = new User(pool);
      const friendExists = await user.getUserIdByUsername(friendName);
      let friendId;
      if (friendExists.length) {
        friendId = friendExists[0].user_id;
      } else {
        res.send({message: 'User not found.'});
        return next();
      }
      const userId = req.session.userInfo.userId;
      const friendship = new Friendship(pool);
      await friendship.unblockUser(userId, friendId);
      res.send({message: 'User unblocked.'});
      next();
    } catch(err) {
      next(err);
    }
  }
};

module.exports = userFriendshipController;