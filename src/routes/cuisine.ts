import { Router } from 'express';
import { param } from 'express-validator';
import { Pool } from 'mysql2/promise';

import { CuisineController } from '../controllers/cuisine';
import { catchExceptions } from '../lib/utils/catchExceptions';

const router = Router();

// for /cuisine/...

export function cuisineRouter(pool: Pool) {
  const controller = new CuisineController(pool);

  router.get(
    '/',
    catchExceptions(controller.view)
  );
  
  router.get(
    '/detail/:id',
    [param('id').not().isEmpty().trim().escape()],
    catchExceptions(controller.viewDetailById)
  );
  
  router.get(
    '/:id',
    [param('id').not().isEmpty().trim().escape()],
    catchExceptions(controller.viewById)
  );

  return router;
}