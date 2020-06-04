import { Router } from 'express';
import { body } from 'express-validator';

import {
  staffCuisineSupplierController
} from '../../controllers/staff/cuisineSupplier';
import { catchExceptions } from '../../lib/utils/catchExceptions';
import { staffIsAuth } from '../../lib/utils/staffIsAuth';

export const router = Router();

// /v1/... ?

// for /staff/cuisine-supplier/...

router.post(
  '/create',
  staffIsAuth,
  [body('supplierId').not().isEmpty().trim().escape()],
  catchExceptions(
    staffCuisineSupplierController.createCuisineSupplier
  )
);

router.delete(
  '/delete',
  staffIsAuth,
  [
    body('cuisineId').not().isEmpty().trim().escape(),
    body('supplierId').not().isEmpty().trim().escape()
  ],
  catchExceptions(
    staffCuisineSupplierController.deleteCuisineSupplier
  )
);