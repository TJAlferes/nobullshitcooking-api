import { Router } from 'express';
import { body } from 'express-validator';
import { Pool } from 'mysql2/promise';

import {
  StaffCuisineSupplierController
} from '../../controllers/staff/cuisineSupplier';
import { catchExceptions } from '../../lib/utils/catchExceptions';
import { staffIsAuth } from '../../lib/utils/staffIsAuth';

const router = Router();

// for /staff/cuisine-supplier/...

export function staffCuisineSupplierRouter(pool: Pool) {
  const controller = new StaffCuisineSupplierController(pool);

  router.post(
    '/create',
    staffIsAuth,
    [
      body('cuisine').not().isEmpty().trim().escape(),
      body('supplier').not().isEmpty().trim().escape()
    ],
    catchExceptions(controller.create)
  );

  router.delete(
    '/delete',
    staffIsAuth,
    [
      body('cuisine').not().isEmpty().trim().escape(),
      body('supplier').not().isEmpty().trim().escape()
    ],
    catchExceptions(controller.delete)
  );

  return router;
}