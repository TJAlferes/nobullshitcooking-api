import { Router } from 'express';
import { body } from 'express-validator';
import { Pool } from 'mysql2/promise';

import { UserPlanController } from '../../controllers/user';
import { catchExceptions, userIsAuth } from '../../lib/utils';

const router = Router();

// for /user/plan/...

export function userPlanRouter(pool: Pool) {
  const controller = new UserPlanController(pool);

  router.post('/', userIsAuth, catchExceptions(controller.view));

  router.post('/one', userIsAuth, [body('id').not().isEmpty().trim().escape()], catchExceptions(controller.viewById));

  router.post('/create', userIsAuth, [
    body(['name', 'data']).not().isEmpty().trim().escape()
  ], catchExceptions(controller.create));

  router.put('/update', userIsAuth, [
    body(['id', 'name', 'data']).not().isEmpty().trim().escape()
  ], catchExceptions(controller.update));

  router.delete('/delete', userIsAuth, [body('id').not().isEmpty().trim().escape()], catchExceptions(controller.deleteById));

  return router;
}