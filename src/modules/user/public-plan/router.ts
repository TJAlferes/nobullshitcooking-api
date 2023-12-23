import { Router } from 'express';
import { body, param } from 'express-validator';

import { catchExceptions, userIsAuth } from '../../../utils';
import { publicPlanController as controller } from './controller';

const router = Router();

// for /users/:username/public-plans

export function publicPlanRouter() {
  router.get(
    '/:plan_name',
    sanitizeParams('plan_name'),
    catchExceptions(controller.viewOne)
  );

  router.get(
    '/',
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
    catchExceptions(controller.unattributeOne)
  );

  return router;
}

function sanitizeBody(keys: string | string[]) {
  return body(keys).trim().notEmpty();
}

function sanitizeParams(keys: string | string[]) {
  return param(keys).trim().notEmpty();
}
