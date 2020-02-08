const { Router } = require('express');

const userIsAuth = require('../../lib/utils/userIsAuth');
const catchExceptions = require('../../lib/utils/catchExceptions');

const userAuthController = require('../../controllers/user/auth');

const router = Router();

// /v1/... ?

// for /user/auth/...

router.post(
  '/register',
  catchExceptions(userAuthController.register)
);

router.post(
  '/verify',
  catchExceptions(userAuthController.verify)
);

router.post(
  '/resend-confirmation-code',
  catchExceptions(userAuthController.resendConfirmationCode)
);

router.post(
  '/login',
  catchExceptions(userAuthController.login)
);

router.post(
  '/logout',
  catchExceptions(userAuthController.logout)
);

router.post(
  '/set-avatar',
  userIsAuth,
  catchExceptions(userAuthController.setAvatar)
);

router.post(
  '/update/username',
  catchExceptions(userAuthController.updateUsername)
);

router.post(
  '/update/email',
  catchExceptions(userAuthController.updateEmail)
);

router.post(
  '/update/password',
  catchExceptions(userAuthController.updatePassword)
);

router.post(
  '/delete-account',
  catchExceptions(userAuthController.deleteAccount)
);

module.exports = router;