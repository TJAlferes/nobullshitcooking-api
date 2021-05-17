import { Router } from 'express';
import { body } from 'express-validator';
import { Pool } from 'mysql2/promise';

import { UserFriendshipController } from '../../controllers/user';
import { catchExceptions, userIsAuth } from '../../lib/utils';

const router = Router();

// for /user/friendship/...

export function userFriendshipRouter(pool: Pool) {
  const controller = new UserFriendshipController(pool);

  router.post(
    '/',
    userIsAuth,
    catchExceptions(controller.view)
  );

  router.post(
    '/create',
    userIsAuth,
    [body('friendName').not().isEmpty().trim().escape()],
    catchExceptions(controller.create)
  );

  router.put(
    '/accept',
    userIsAuth,
    [body('friendName').not().isEmpty().trim().escape()],
    catchExceptions(controller.accept)
  );

  router.put(
    '/reject',
    userIsAuth,
    [body('friendName').not().isEmpty().trim().escape()],
    catchExceptions(controller.reject)
  );

  router.delete(
    '/delete',
    userIsAuth,
    [body('friendName').not().isEmpty().trim().escape()],
    catchExceptions(controller.delete)
  );

  router.post(
    '/block',
    userIsAuth,
    [body('friendName').not().isEmpty().trim().escape()],
    catchExceptions(controller.block)
  );

  router.delete(
    '/unblock',
    userIsAuth,
    [body('friendName').not().isEmpty().trim().escape()],
    catchExceptions(controller.unblock)
  );

  return router;
}