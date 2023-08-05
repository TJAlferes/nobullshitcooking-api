import { Router } from 'express';
import { body }   from 'express-validator';

import { UserPublicPlanController }    from '../../controllers/user';
import { catchExceptions, userIsAuth } from '../../lib/utils';

const router = Router();

// for /user/plan/...

export function userPublicPlanRouter() {
  const controller = new UserPublicPlanController();

  router.post('/all',      userIsAuth,                                     catchExceptions(controller.viewAll));
  router.post('/one',      userIsAuth, [sanitize('id')],                   catchExceptions(controller.viewOne));
  router.post('/create',   userIsAuth, [sanitize(['name', 'data'])],       catchExceptions(controller.create));
  router.put('/update',    userIsAuth, [sanitize(['id', 'name', 'data'])], catchExceptions(controller.update));
  router.delete('/delete', userIsAuth, [sanitize('id')],                   catchExceptions(controller.deleteOne));

  return router;
}

function sanitize(keys: string | string[]) {
  return body(keys).not().isEmpty().trim().escape();
}
