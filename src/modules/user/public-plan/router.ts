import { Router } from 'express';
import { body, param } from 'express-validator';

import { catchExceptions, userIsAuth } from '../../../index.js';
import { publicPlanController as controller } from './controller.js';

const router = Router();

// for /users/:username/public-plans

export function publicPlanRouter() {
  router.get(
    '/:plan_id',
    sanitizeParams('plan_id'),
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
    '/:plan_id/unattribute',
    userIsAuth,
    sanitizeParams('plan_id'),
    catchExceptions(controller.unattributeOne)
  );

  router.patch(
    '/update',
    userIsAuth,
    sanitizeBody(['plan_id', 'plan_name', 'included_recipes.*.*']),
    catchExceptions(controller.update)
  );

  return router;
}

function sanitizeBody(keys: string | string[]) {
  return body(keys).not().isEmpty().trim().escape();
}

function sanitizeParams(keys: string | string[]) {
  return param(keys).not().isEmpty().trim().escape();
}
