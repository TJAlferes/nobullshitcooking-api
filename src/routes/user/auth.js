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
  '/change-username',
  catchExceptions(userAuthController.changeUsername)
);

router.post(
  '/change-email',
  catchExceptions(userAuthController.changeEmail)
);

router.post(
  '/change-password',
  catchExceptions(userAuthController.changePassword)
);

router.post(
  '/delete-account',
  catchExceptions(userAuthController.deleteAccount)
);

module.exports = router;