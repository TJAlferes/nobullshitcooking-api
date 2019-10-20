const pool = require('../../lib/connections/mysqlPoolConnection');
const User = require('../../mysql-access/User');
const Friendship = require('../../mysql-access/Friendship');
const validFriendshipEntity = require('../../lib/validations/friendship/friendshipEntity');

const userFriendshipController = {
  viewAllMyFriendships: async function(req, res) {
    const userId = req.session.userInfo.userId;
    const friendship = new Friendship(pool);
    const rows = await friendship.viewAllMyFriendships(userId);
    res.send(rows);
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
    const status1 = "pending-sent";
    const status2 = "pending-received";
    const friendshipToCreate = validFriendshipEntity({userId, friendId, status1, status2});
    const friendship = new Friendship(pool);

    const blockedBy = await friendship.checkIfBlockedBy(userId, friendId);
    if (blockedBy.length) return res.send({message: 'User not found.'});

    const friendshipExists = await friendship.getFriendshipByFriendId(userId, friendId);
    if (friendshipExists.length) {
      if (friendshipExists[0].status === "pending-sent") {
        return res.send({message: 'Already sent.'});
      }
      if (friendshipExists[0].status === "pending-received") {
        return res.send({message: 'Already received.'});
      }
      if (friendshipExists[0].status === "accepted") {
        return res.send({message: 'Already friends.'});
      }
      if (friendshipExists[0].status === "blocked") {
        return res.send({message: 'User blocked. First unblock.'});
      }
    }

    await friendship.createFriendship(friendshipToCreate);
    res.send({message: 'Friendship request sent.'});
  },
  acceptFriendship: async function(req, res) {
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
    const friendship = new Friendship(pool);
    await friendship.acceptFriendship(userId, friendId);
    res.send({message: 'Friendship request accepted.'});
  },
  rejectFriendship: async function(req, res) {
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
    const friendship = new Friendship(pool);
    await friendship.rejectFriendship(userId, friendId);
    res.send({message: 'Friendship request rejected.'});
  },
  deleteFriendship: async function(req, res) {
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
    const friendship = new Friendship(pool);
    await friendship.deleteFriendship(userId, friendId);
    res.send({message: 'No longer friends. Maybe again later.'});
  },
  blockUser: async function(req, res) {
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
    const friendship = new Friendship(pool);
    await friendship.blockUser(userId, friendId);
    res.send({message: 'User blocked.'});
  },
  unblockUser: async function(req, res) {
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
    const friendship = new Friendship(pool);
    await friendship.unblockUser(userId, friendId);
    res.send({message: 'User unblocked.'});
  }
};

module.exports = userFriendshipController;