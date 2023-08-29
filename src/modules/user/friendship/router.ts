import { Router } from 'express';
import { body }   from 'express-validator';

import { catchExceptions, userIsAuth }            from '../../../utils';
import { userFriendshipController as controller } from './controller';

const router = Router();

// for /user/friendship/...

export function userFriendshipRouter() {
  router.post(  '/',        userIsAuth,                     catchExceptions(controller.view));
  router.post(  '/create',  userIsAuth, sanitize('friend'), catchExceptions(controller.create));
  router.put(   '/accept',  userIsAuth, sanitize('friend'), catchExceptions(controller.accept));
  router.put(   '/reject',  userIsAuth, sanitize('friend'), catchExceptions(controller.reject));
  router.delete('/delete',  userIsAuth, sanitize('friend'), catchExceptions(controller.delete));
  router.post(  '/block',   userIsAuth, sanitize('friend'), catchExceptions(controller.block));
  router.delete('/unblock', userIsAuth, sanitize('friend'), catchExceptions(controller.unblock));

  return router;
}

function sanitize(keys: string | string[]) {
  return body(keys).not().isEmpty().trim().escape();
}
