import { Router } from 'express';
import { body }   from 'express-validator';

import { UserPublicPlanController }    from '../../controllers/user';
import { catchExceptions, userIsAuth } from '../../lib/utils';

const router = Router();

// for /user/plan/...

export function userPublicPlanRouter() {
  const controller = new UserPublicPlanController();

  router.post(  '/all',    userIsAuth,                                                    catchExceptions(controller.viewAll));
  router.post(  '/one',    userIsAuth, [sanitize('plan_id')],                             catchExceptions(controller.viewOne));
  router.post(  '/create', userIsAuth, [sanitize(['plan_name', 'plan_data'])],            catchExceptions(controller.create));
  router.put(   '/update', userIsAuth, [sanitize(['plan_id', 'plan_name', 'plan_data'])], catchExceptions(controller.update));
  router.delete('/delete', userIsAuth, [sanitize('plan_id')],                             catchExceptions(controller.deleteOne));

  return router;
}

function sanitize(keys: string | string[]) {
  return body(keys).not().isEmpty().trim().escape();
}
