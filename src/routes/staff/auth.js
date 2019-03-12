const { Router } = require('express');

const staffIsAuth = require('../../lib/utils/staffIsAuth');
const catchExceptions = require('../../lib/utils/catchExceptions');
const staffAuthController = require('../../controllers/staff/auth');

const router = Router();

// /v1/... ?

// for /staff/auth/...

router.get(
  '/logout',
  staffIsAuth,
  catchExceptions(staffAuthController.logout)
);

router.post(
  '/login',
  /*validation, */
  catchExceptions(staffAuthController.login)
);

router.post(
  '/register',
  /*validation, */
  catchExceptions(staffAuthController.register)
);

module.exports = router;