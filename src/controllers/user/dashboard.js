//const pool = require('../../data-access/dbPoolConnection');

const userDashboardController = {
  viewDashboard: function(req, res) {
    res.send('your user dashboard');
  }
};

module.exports = userDashboardController;