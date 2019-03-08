const express = require('express');

const staffDashboardController = require('../../controllers/staff/dashboard');
const staffIsAuth = require('../../lib/utils/staffIsAuth');

const router = express.Router();

// /v1/... ?
// catchExceptions()?

// for /staff/dashboard/...

router.get('/dashboard', staffIsAuth, staffDashboardController.viewDashboard);

module.exports = router;