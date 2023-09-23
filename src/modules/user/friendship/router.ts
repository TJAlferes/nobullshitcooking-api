import { Router } from 'express';
import { body }   from 'express-validator';

import { catchExceptions, userIsAuth }            from '../../../utils';
import { userFriendshipController as controller } from './controller';

const router = Router();

// for /user/friendship/...

export function friendshipRouter() {
  router.post(  '/',        userIsAuth,                         catchExceptions(controller.viewAll));
  router.post(  '/create',  userIsAuth, sanitize('friendname'), catchExceptions(controller.create));
  router.put(   '/accept',  userIsAuth, sanitize('friendname'), catchExceptions(controller.accept));
  router.put(   '/reject',  userIsAuth, sanitize('friendname'), catchExceptions(controller.reject));
  router.delete('/delete',  userIsAuth, sanitize('friendname'), catchExceptions(controller.delete));
  router.post(  '/block',   userIsAuth, sanitize('friendname'), catchExceptions(controller.block));
  router.delete('/unblock', userIsAuth, sanitize('friendname'), catchExceptions(controller.unblock));

  return router;
}

function sanitize(keys: string | string[]) {
  return body(keys).not().isEmpty().trim().escape();
}
