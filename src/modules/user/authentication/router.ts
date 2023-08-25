import { Router } from 'express';
import { body }   from 'express-validator';

import { userAuthenticationController as controller } from './controller';
import { catchExceptions, userIsAuth }  from '../../../utils';

const router = Router();

// for /user/authentication

export function userAuthenticationRouter() {
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
