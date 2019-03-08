const { Router } = require('express');

const staffAuthController = require('../../controllers/staff/auth');
const catchExceptions = require('../../lib/utils/catchExceptions');

const router = Router();

router.get(
  '/logout',
  /*validation, */
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