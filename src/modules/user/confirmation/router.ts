import { Router } from 'express';
import { body }   from 'express-validator';

import { UserConfirmationController } from './controller';
import { catchExceptions }            from '../../../utils';

const router = Router();

// for /user/confirmation

export function userConfirmationRouter() {
  const controller = new UserConfirmationController();

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
