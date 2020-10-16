import { Router } from 'express';
import { param } from 'express-validator';
import { Pool } from 'mysql2/promise';

import { MethodController } from '../controllers/method';
import { catchExceptions } from '../lib/utils/catchExceptions';

const router = Router();

// for /method/...

export function methodRouter(pool: Pool) {
  const controller = new MethodController(pool);

  router.get(
    '/',
    catchExceptions(controller.view)
  );
  
  router.get(
    '/:name',
    [param('name').not().isEmpty().trim().escape()],
    catchExceptions(controller.viewByName)
  );

  return router;
}