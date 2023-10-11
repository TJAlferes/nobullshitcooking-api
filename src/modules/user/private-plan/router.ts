import { Router } from 'express';
import { body, param } from 'express-validator';

import { catchExceptions, userIsAuth } from '../../../utils';
import { privatePlanController as controller } from './controller';

const router = Router();

// for /users/:username/private-plans

export function privatePlanRouter() {
  router.get(
    '/:plan_id',
    userIsAuth,
    sanitizeParams('plan_id'),
    catchExceptions(controller.viewOne)
  );  // is this needed???

  router.get(
    '/',
    userIsAuth,
    catchExceptions(controller.viewAll)
  );

  router.post(
    '/',
    userIsAuth,
    sanitizeBody(['plan_name', 'included_recipes.*.*']),
    catchExceptions(controller.create)
  );

  router.patch(
    '/',
    userIsAuth,
    sanitizeBody(['plan_id', 'plan_name', 'included_recipes.*.*']),
    catchExceptions(controller.update)
  );

  router.delete(
    '/:plan_id',
    userIsAuth,
    sanitizeParams('plan_id'),
    catchExceptions(controller.deleteOne)
  );

  return router;
}

function sanitizeBody(keys: string | string[]) {
  return body(keys).not().isEmpty().trim().escape();
}

function sanitizeParams(keys: string | string[]) {
  return param(keys).not().isEmpty().trim().escape();
}
