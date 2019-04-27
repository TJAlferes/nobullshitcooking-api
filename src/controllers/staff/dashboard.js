//const pool = require('../../data-access/dbPoolConnection');

const staffDashboardController = {
  viewDashboard: function(req, res) {
    res.send('your staff dashboard');
  }
};

module.exports = staffDashboardController;