const { Router } = require('express');

const staffIsAuth = require('../../lib/utils/staffIsAuth');
const catchExceptions = require('../../lib/utils/catchExceptions');
const staffAuthController = require('../../controllers/staff/auth');

const router = Router();

// /v1/... ?

// for /staff/auth/...

router.get(
  '/auth/logout',
  staffIsAuth,
  catchExceptions(staffAuthController.logout)
);

router.post(
  '/auth/login',
  !staffIsAuth,
  catchExceptions(staffAuthController.login)
);

router.post(
  '/auth/register',
  !staffIsAuth,
  catchExceptions(staffAuthController.register)
);

module.exports = router;