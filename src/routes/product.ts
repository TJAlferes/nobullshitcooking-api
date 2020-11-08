import { Router } from 'express';
import { param } from 'express-validator';
import { Pool } from 'mysql2/promise';

import { ProductController } from '../controllers/product';
import { catchExceptions } from '../lib/utils/catchExceptions';

const router = Router();

// for /product/...

export function methodRouter(pool: Pool) {
  const controller = new ProductController(pool);

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