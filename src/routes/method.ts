import { Router } from 'express';
import { param } from 'express-validator';
import { Pool } from 'mysql2/promise';

import { MethodController } from '../controllers';
import { catchExceptions } from '../lib/utils';

const router = Router();

// for /method/...

export function methodRouter(pool: Pool) {
  const controller = new MethodController(pool);

  router.get(
    '/',
    catchExceptions(controller.view)
  );
  
  router.get(
    '/:id',
    [param('id').not().isEmpty().trim().escape()],
    catchExceptions(controller.viewById)
  );

  return router;
}