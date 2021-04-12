import { Router } from 'express';
import { body } from 'express-validator';
import { Pool } from 'mysql2/promise';

import { UserFriendshipController } from '../../controllers/user';
import { catchExceptions } from '../../lib/utils/catchExceptions';
import { userIsAuth } from '../../lib/utils/userIsAuth';

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
    [body('friendname').not().isEmpty().trim().escape()],
    catchExceptions(controller.create)
  );

  router.put(
    '/accept',
    userIsAuth,
    [body('friendname').not().isEmpty().trim().escape()],
    catchExceptions(controller.accept)
  );

  router.put(
    '/reject',
    userIsAuth,
    [body('friendname').not().isEmpty().trim().escape()],
    catchExceptions(controller.reject)
  );

  router.delete(
    '/delete',
    userIsAuth,
    [body('friendname').not().isEmpty().trim().escape()],
    catchExceptions(controller.delete)
  );

  router.post(
    '/block',
    userIsAuth,
    [body('friendname').not().isEmpty().trim().escape()],
    catchExceptions(controller.block)
  );

  router.delete(
    '/unblock',
    userIsAuth,
    [body('friendname').not().isEmpty().trim().escape()],
    catchExceptions(controller.unblock)
  );

  return router;
}