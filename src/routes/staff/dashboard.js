const { Router } = require('express');

const staffIsAuth = require('../../lib/utils/staffIsAuth');
const catchExceptions = require('../../lib/utils/catchExceptions');
const staffDashboardController = require('../../controllers/staff/dashboard');

const router = Router();

// /v1/... ?

// for /staff/dashboard/...

router.get(
  '/',
  staffIsAuth,
  catchExceptions(staffDashboardController.viewDashboard)
);

module.exports = router;