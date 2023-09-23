import { Router } from 'express';
import { body }   from 'express-validator';

import { catchExceptions, userIsAuth } from '../../../utils';
import { publicPlanController as controller } from './controller';

const router = Router();

// for /users/:username/plans

export function publicPlanRouter() {
  router.get(
    '/',
    catchExceptions(controller.viewAll)
  );

  router.get(
    '/:plan_id',
    [sanitize('plan_id')],
    catchExceptions(controller.viewOne)
  );

  router.post(
    '/',
    userIsAuth,
    [sanitize(['plan_name', 'plan_data'])],
    catchExceptions(controller.create)
  );

  router.patch(
    '/',
    userIsAuth,
    [sanitize(['plan_id', 'plan_name', 'plan_data'])],
    catchExceptions(controller.update)
  );

  router.delete(
    '/',
    userIsAuth,
    [sanitize('plan_id')],
    catchExceptions(controller.deleteOne)
  );

  return router;
}

function sanitize(keys: string | string[]) {
  return body(keys).not().isEmpty().trim().escape();
}
