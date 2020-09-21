import { Router } from 'express';
import { param } from 'express-validator';
import { Pool } from 'mysql2/promise';

import { CuisineSupplierController } from '../controllers/cuisineSupplier';
import { catchExceptions } from '../lib/utils/catchExceptions';

export const router = Router();

// for /cuisine-supplier/...

export function cuisineSupplierRouter(pool: Pool) {
  const controller = new CuisineSupplierController(pool);

  router.get(
    '/:id',
    [param('id').not().isEmpty().trim().escape()],
    catchExceptions(controller.viewByCuisineId)
  );

  return router;
}