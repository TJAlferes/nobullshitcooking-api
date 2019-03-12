const { Router } = require('express');

const userIsAuth = require('../../lib/utils/userIsAuth');
const catchExceptions = require('../../lib/utils/catchExceptions');
const userDashboardController = require('../../controllers/user/dashboard');

const router = Router();

// /v1/... ?

// for /user/dashboard/...

router.get(
  '/dashboard',
  userIsAuth,
  catchExceptions(userDashboardController.viewDashboard)
);

module.exports = router;