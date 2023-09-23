import { Router } from 'express';
import { body }   from 'express-validator';

import { catchExceptions, userIsAuth } from '../../../utils';
import { privatePlanController as controller } from './controller';

const router = Router();

// for /users/:username/private-plans

export function privatePlanRouter() {
  router.get(
    '/',
    userIsAuth,
    catchExceptions(controller.viewAll)
  );

  router.get(
    '/:plan_id',
    userIsAuth,
    sanitize('plan_id'),
    catchExceptions(controller.viewOne)
  );

  router.post(
    '/',
    userIsAuth,
    sanitize(['plan_name', 'plan_data']),
    catchExceptions(controller.create)
  );

  router.patch(
    '/',
    userIsAuth,
    sanitize(['plan_id', 'plan_name', 'plan_data']),
    catchExceptions(controller.update)
  );

  router.delete(
    '/',
    userIsAuth,
    sanitize('plan_id'),
    catchExceptions(controller.deleteOne)
  );

  return router;
}

function sanitize(keys: string | string[]) {
  return body(keys).not().isEmpty().trim().escape();
}
