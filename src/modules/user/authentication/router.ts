import { Router } from 'express';
import { body }   from 'express-validator';

import { catchExceptions, userIsAuth }                from '../../../utils';
import { userAuthenticationController as controller } from './controller';

const router = Router();

// for /user/authentication

export function authenticationRouter() {

  router.post(
    '/confirm',
    sanitize(['confirmation_code']),
    catchExceptions(controller.confirm)
  );

  router.post(
    '/resend-confirmation-code',
    sanitize(['email', 'password']),
    catchExceptions(controller.resendConfirmationCode)
  );

  router.post(
    '/login',
    sanitize(['email', 'password']),
    catchExceptions(controller.login)
  );

  router.post(
    '/logout',
    userIsAuth,
    catchExceptions(controller.logout)
  );

  return router;
}

function sanitize(keys: string | string[]) {
  return body(keys).not().isEmpty().trim().escape();
}
