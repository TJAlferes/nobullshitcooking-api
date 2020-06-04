import { Router } from 'express';
import { body } from 'express-validator';

import { userAuthController } from '../../controllers/user/auth';
import { catchExceptions } from '../../lib/utils/catchExceptions';
import { userIsAuth } from '../../lib/utils/userIsAuth';

export const router = Router();

// /v1/... ?

// for /user/auth/...

router.post(
  '/register',
  [
    body('email').not().isEmpty().trim().escape(),
    body('password').not().isEmpty().trim().escape(),
    body('username').not().isEmpty().trim().escape()
  ],
  catchExceptions(userAuthController.register)
);

router.post(
  '/verify',
  [
    body('email').not().isEmpty().trim().escape(),
    body('password').not().isEmpty().trim().escape(),
    body('confirmationCode').not().isEmpty().trim().escape()
  ],
  catchExceptions(userAuthController.verify)
);

router.post(
  '/resend-confirmation-code',
  [
    body('email').not().isEmpty().trim().escape(),
    body('password').not().isEmpty().trim().escape()
  ],
  catchExceptions(userAuthController.resendConfirmationCode)
);

router.post(
  '/login',
  [
    body('email').not().isEmpty().trim().escape(),
    body('password').not().isEmpty().trim().escape()
  ],
  catchExceptions(userAuthController.login)
);

router.post(
  '/logout',
  userIsAuth,
  catchExceptions(userAuthController.logout)
);

router.post(
  '/set-avatar',
  userIsAuth,

  catchExceptions(userAuthController.setAvatar)
);

router.post(
  '/update/username',
  userIsAuth,
  [body('avatar').not().isEmpty().trim().escape()],
  catchExceptions(userAuthController.updateUsername)
);

router.post(
  '/update/email',
  userIsAuth,

  catchExceptions(userAuthController.updateEmail)
);

router.post(
  '/update/password',
  userIsAuth,

  catchExceptions(userAuthController.updatePassword)
);

router.post(
  '/delete-account',
  userIsAuth,

  catchExceptions(userAuthController.deleteAccount)
);