import { Router } from 'express';
import { body }   from 'express-validator';

import { privatePlanController as controller } from './controller';
import { catchExceptions, userIsAuth } from '../../../../utils';

const router = Router();

// for /user/private/plan/...

export function privatePlanRouter() {
  router.post(
    '/all',
    userIsAuth,
    catchExceptions(controller.viewAll)
  );

  router.post(
    '/one',
    userIsAuth,
    sanitize('plan_id'),
    catchExceptions(controller.viewOne)
  );

  router.post(
    '/create',
    userIsAuth,
    sanitize(['plan_name', 'plan_data']),
    catchExceptions(controller.create)
  );

  router.put(
    '/update',
    userIsAuth,
    sanitize(['plan_id', 'plan_name', 'plan_data']),
    catchExceptions(controller.update)
  );

  router.delete(
    '/delete',
    userIsAuth,
    sanitize('plan_id'),
    catchExceptions(controller.deleteOne)
  );

  return router;
}

function sanitize(keys: string | string[]) {
  return body(keys).not().isEmpty().trim().escape();
}
