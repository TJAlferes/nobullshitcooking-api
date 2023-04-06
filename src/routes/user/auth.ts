import { Router } from 'express';
import { body }   from 'express-validator';
import { Pool }   from 'mysql2/promise';

import { UserAuthController }          from '../../controllers/user';
import { catchExceptions, userIsAuth } from '../../lib/utils';

const router = Router();

// for /user/auth/...

export function userAuthRouter(pool: Pool) {
  const controller = new UserAuthController(pool);

  router.post('/register',                 [bodySanitizer(['email', 'pass', 'username'])],         catchExceptions(controller.register));
  router.post('/resend-confirmation-code', [bodySanitizer(['email', 'pass'])],                     catchExceptions(controller.resendConfirmationCode));
  router.post('/verify',                   [bodySanitizer(['email', 'pass', 'confirmationCode'])], catchExceptions(controller.verify));

  router.post('/login',  [bodySanitizer(['email', 'pass'])], catchExceptions(controller.login));
  router.post('/logout', userIsAuth,                         catchExceptions(controller.logout));

  router.post('/update', userIsAuth, [bodySanitizer(['email', 'pass', 'username'])], catchExceptions(controller.update));  // why POST?

  router.post('/delete', userIsAuth, catchExceptions(controller.delete));  // why POST?

  return router;
}

function bodySanitizer(keys: string | string[]) {
  return body(keys).not().isEmpty().trim().escape();
}
