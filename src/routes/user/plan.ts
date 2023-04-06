import { Router } from 'express';
import { body }   from 'express-validator';
import { Pool }   from 'mysql2/promise';

import { UserPublicPlanController }    from '../../controllers/user';
import { catchExceptions, userIsAuth } from '../../lib/utils';

const router = Router();

// for /user/plan/...

export function userPublicPlanRouter(pool: Pool) {
  const controller = new UserPublicPlanController(pool);

  router.post('/all',      userIsAuth,                                          catchExceptions(controller.viewAll));
  router.post('/one',      userIsAuth, [bodySanitizer('id')],                   catchExceptions(controller.viewOne));
  router.post('/create',   userIsAuth, [bodySanitizer(['name', 'data'])],       catchExceptions(controller.create));
  router.put('/update',    userIsAuth, [bodySanitizer(['id', 'name', 'data'])], catchExceptions(controller.update));
  router.delete('/delete', userIsAuth, [bodySanitizer('id')],                   catchExceptions(controller.deleteOne));

  return router;
}

function bodySanitizer(keys: string | string[]) {
  return body(keys).not().isEmpty().trim().escape();
}
