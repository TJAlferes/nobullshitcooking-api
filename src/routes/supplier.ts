import { Router } from 'express';
import { param } from 'express-validator';
import { Pool } from 'mysql2/promise';

import { SupplierController } from '../controllers/supplier';
import { catchExceptions } from '../lib/utils/catchExceptions';

const router = Router();

// for /supplier/...

export function supplierRouter(pool: Pool) {
  const controller = new SupplierController(pool);

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