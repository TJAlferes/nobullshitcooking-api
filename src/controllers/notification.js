const uuidv4 = require('uuid/v4');

//const pool = require('../data-access/dbPoolConnection');
//const User = require('../data-access/user/User');

const notificationController = {
  viewNotificationForUser: async function(req, res, next) {
    try {
      const userId = req.session.userInfo.userId;
      next();
    } catch(err) {
      next(err);
    }
  },
  viewAllNotificationsForUser: async function(req, res, next) {
    try {
      const userId = req.session.userInfo.userId;
      next();
    } catch(err) {
      next(err);
    }
  },
  markNotificationAsRead: async function(req, res, next) {
    try {
      const userId = req.session.userInfo.userId;
      next();
    } catch(err) {
      next(err);
    }
  },
  createNotification: async function(req, res, next) {
    try {
      // if referenced in any way
      // so if favorited/saved
      // if used as subrecipe
      // if used in plan
      next();
    } catch(err) {
      next(err);
    }
  }
};

module.exports = notificationController;