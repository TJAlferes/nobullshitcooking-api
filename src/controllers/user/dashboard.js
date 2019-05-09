//const pool = require('../../data-access/dbPoolConnection');

const userDashboardController = {
  viewDashboard: async function(req, res, next) {
    res.send('your user dashboard');
  }
};

module.exports = userDashboardController;