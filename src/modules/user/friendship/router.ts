import { Router } from 'express';
import { param }   from 'express-validator';

import { catchExceptions, userIsAuth }        from '../../../index.js';
import { friendshipController as controller } from './controller.js';

const router = Router();

// for /users/:username/friendships/:friendname

export function friendshipRouter() {
  router.get(
    '/',
    userIsAuth,
    catchExceptions(controller.viewAll)
  );
  
  router.post(
    '/create',
    userIsAuth,
    sanitizeParams('friendname'),
    catchExceptions(controller.create)
  );
  
  router.put(
    '/accept',
    userIsAuth,
    sanitizeParams('friendname'),
    catchExceptions(controller.accept)
  );
  
  router.put(
    '/reject',
    userIsAuth,
    sanitizeParams('friendname'),
    catchExceptions(controller.reject)
  );
  
  router.delete(
    '/delete',
    userIsAuth,
    sanitizeParams('friendname'),
    catchExceptions(controller.delete)
  );
  
  router.post(
    '/block',
    userIsAuth,
    sanitizeParams('friendname'),
    catchExceptions(controller.block)
  );
  
  router.delete(
    '/unblock',
    userIsAuth,
    sanitizeParams('friendname'),
    catchExceptions(controller.unblock)
  );

  return router;
}

function sanitizeParams(keys: string | string[]) {
  return param(keys).not().isEmpty().trim().escape();
}
