const express = require('express');

const userDashboardController = require('../../controllers/user/dashboard');
const userIsAuth = require('../../lib/utils/userIsAuth');

const router = express.Router();

// /v1/... ?
// catchExceptions()?

// for /user/dashboard/...

router.get('/dashboard', userIsAuth, userDashboardController.viewDashboard);

module.exports = router;