import { Router } from 'express';
import { body, param } from 'express-validator';

import { catchExceptions, userIsAuth } from '../../../utils';
import { userImageController as controller } from './controller';

//const router = Router();

// for /users/:username/avatars

export function userImageRouter(router: Router) {
  router.get(
    '/current',
    catchExceptions(controller.viewCurrent)
  );

  router.get(
    '/',
    userIsAuth,
    catchExceptions(controller.viewAll)
  );

  router.post(
    '/',
    userIsAuth,
    sanitizeBody('new_avatar'),
    catchExceptions(controller.create)
  );

  router.delete(
    '/:image_id',
    userIsAuth,
    sanitizeParams('image_id'),
    catchExceptions(controller.delete)
  )

  return router;
}

function sanitizeBody(keys: string | string[]) {
  return body(keys).trim().notEmpty();
}

function sanitizeParams(keys: string | string[]) {
  return param(keys).trim().notEmpty();
}
