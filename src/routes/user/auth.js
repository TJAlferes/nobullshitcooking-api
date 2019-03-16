const { Router } = require('express');

const userIsAuth = require('../../lib/utils/userIsAuth');
const catchExceptions = require('../../lib/utils/catchExceptions');
const userAuthController = require('../../controllers/user/auth');

const router = Router();

// /v1/... ?

// for /user/auth/...

router.get(
  '/auth/logout',
  userIsAuth,
  catchExceptions(userAuthController.logout)
);

router.post(
  '/auth/login',
  /*validation, */
  catchExceptions(userAuthController.login)
);

router.post(
  '/auth/register',
  /*validation, */
  catchExceptions(userAuthController.register)
);

module.exports = router;