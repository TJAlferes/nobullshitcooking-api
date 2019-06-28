const { Router } = require('express');

//const userIsAuth = require('../../lib/utils/userIsAuth');
const catchExceptions = require('../../lib/utils/catchExceptions');
const userAuthController = require('../../controllers/user/auth');

const router = Router();

// /v1/... ?

// for /user/auth/...

router.post(
  '/logout',
  //userIsAuth,
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

router.post(
  '/verify',
  /*validation, */
  catchExceptions(userAuthController.verify)
);

module.exports = router;