import { Router } from 'express';
import { param } from 'express-validator';

import { catchExceptions, tryCatch, userIsAuth } from '../../../utils';
import { friendshipController as controller } from './controller';

const router = Router();

// for /users/:username/friendships

export function friendshipRouter() {
  router.get(
    '/',
    userIsAuth,
    catchExceptions(controller.viewAll)
  );
  
  router.post(
    '/:friendname/create',
    userIsAuth,
    sanitizeParams('friendname'),
    catchExceptions(controller.create)
  );
  
  router.patch(
    '/:friendname/accept',
    userIsAuth,
    sanitizeParams('friendname'),
    catchExceptions(controller.accept)
  );
  
  router.delete(
    '/:friendname/reject',
    userIsAuth,
    sanitizeParams('friendname'),
    catchExceptions(controller.reject)
  );
  
  router.delete(
    '/:friendname/delete',
    userIsAuth,
    sanitizeParams('friendname'),
    catchExceptions(controller.delete)
  );
  
  router.post(
    '/:friendname/block',
    userIsAuth,
    sanitizeParams('friendname'),
    catchExceptions(controller.block)
  );
  
  router.delete(
    '/:friendname/unblock',
    userIsAuth,
    sanitizeParams('friendname'),
    catchExceptions(controller.unblock)
  );

  return router;
}

function sanitizeParams(keys: string | string[]) {
  return param(keys).not().isEmpty().trim().escape();
}
