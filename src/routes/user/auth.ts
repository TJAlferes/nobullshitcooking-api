import { Router } from 'express';
import { body } from 'express-validator';
import { Pool } from 'mysql2/promise';

import { UserAuthController } from '../../controllers/user';
import { catchExceptions, userIsAuth } from '../../lib/utils';

const router = Router();

// for /user/auth/...

export function userAuthRouter(pool: Pool) {
  const controller = new UserAuthController(pool);

  router.post(
    '/register',
    [
      body('email').not().isEmpty().trim().escape(),
      body('pass').not().isEmpty().trim().escape(),
      body('username').not().isEmpty().trim().escape()
    ],
    catchExceptions(controller.register)
  );

  router.post(
    '/verify',
    [
      body('email').not().isEmpty().trim().escape(),
      body('pass').not().isEmpty().trim().escape(),
      body('confirmationCode').not().isEmpty().trim().escape()
    ],
    catchExceptions(controller.verify)
  );

  router.post(
    '/resend-confirmation-code',
    [
      body('email').not().isEmpty().trim().escape(),
      body('pass').not().isEmpty().trim().escape()
    ],
    catchExceptions(controller.resendConfirmationCode)
  );

  router.post(
    '/login',
    [
      body('email').not().isEmpty().trim().escape(),
      body('pass').not().isEmpty().trim().escape()
    ],
    catchExceptions(controller.login)
  );

  router.post(
    '/logout',
    userIsAuth,
    catchExceptions(controller.logout)
  );

  // why POST?
  router.post(
    '/update',
    userIsAuth,
    [
      body('email').not().isEmpty().trim().escape(),
      body('pass').not().isEmpty().trim().escape(),
      body('username').not().isEmpty().trim().escape()
    ],
    catchExceptions(controller.update)
  );

  // why POST?
  router.post(
    '/delete',
    userIsAuth,
    catchExceptions(controller.delete)
  );

  return router;
}