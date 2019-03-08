const { Router } = require('express');

const userAuthController = require('../../controllers/user/auth');
const catchExceptions = require('../../lib/utils/catchExceptions');

const router = Router();

router.get(
  '/logout',
  /*validation, */
  catchExceptions(userAuthController.logout)
);

router.post(
  '/login',
  /*validation, */
  catchExceptions(userAuthController.login)
);

router.post(
  '/register',
  /*validation, */
  catchExceptions(userAuthController.register)
);

module.exports = router;