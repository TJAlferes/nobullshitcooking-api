import { Router } from 'express';
import { body }   from 'express-validator';

import { catchExceptions }                          from '../../../utils';
import { userConfirmationController as controller } from './controller';

const router = Router();

// for /user/confirmation

export function userConfirmationRouter() {
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

  return router;
}

function sanitize(keys: string | string[]) {
  return body(keys).not().isEmpty().trim().escape();
}
