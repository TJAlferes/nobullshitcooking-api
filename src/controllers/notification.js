const uuidv4 = require('uuid/v4');

//const pool = require('../data-access/dbPoolConnection');
//const User = require('../data-access/user/User');

// NOTE: Notifications are not implemented yet, and possibly never will be

const notificationController = {
  viewNotificationForUser: async function(req, res) {
    const userId = req.session.userInfo.userId;
  },
  viewAllNotificationsForUser: async function(req, res) {
    const userId = req.session.userInfo.userId;
  },
  markNotificationAsRead: async function(req, res) {
    const userId = req.session.userInfo.userId;
  },
  createNotification: async function(req, res) {
    // if referenced in any way
    // so if favorited/saved
    // if used as subrecipe
    // if used in plan
  }
};

module.exports = notificationController;