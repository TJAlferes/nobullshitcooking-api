import { Request, Response, Router } from 'express';
import { Pool } from 'mysql2/promise';

import { UserDataInitController } from '../../controllers/user';
import { catchExceptions, userIsAuth } from '../../lib/utils';

const router = Router();

// for /user/data-init/...

export function userDataInitRouter(pool: Pool) {
  const controller = new UserDataInitController(pool);

  router.post('/', userIsAuth, catchExceptions(controller.viewInitialData));

  return router;
}