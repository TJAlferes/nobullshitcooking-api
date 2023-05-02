import { Router } from 'express';
import { body }   from 'express-validator';
import { Pool }   from 'mysql2/promise';

import { UserPrivatePlanController }   from '../../../controllers/user/private';
import { catchExceptions, userIsAuth } from '../../../lib/utils';

const router = Router();

// for /user/private/plan/...

export function userPrivatePlanRouter(pool: Pool) {
  const controller = new UserPrivatePlanController(pool);

  router.post(
    '/all',
    userIsAuth,
    catchExceptions(controller.viewAll)
  );

  router.post(
    '/one',
    userIsAuth,
    sanitize('id'),
    catchExceptions(controller.viewOne)
  );

  router.post(
    '/create',
    userIsAuth,
    sanitize(['name', 'data']),
    catchExceptions(controller.create)
  );

  router.put(
    '/update',
    userIsAuth,
    sanitize(['id', 'name', 'data']),
    catchExceptions(controller.update)
  );

  router.delete(
    '/delete',
    userIsAuth,
    sanitize('id'),
    catchExceptions(controller.deleteOne)
  );

  return router;
}

function sanitize(keys: string | string[]) {
  return body(keys).not().isEmpty().trim().escape();
}
