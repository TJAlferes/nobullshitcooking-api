import { Router } from 'express';

import { cuisineSupplierController } from '../controllers/cuisineSupplier';
import { catchExceptions } from '../lib/utils/catchExceptions';

export const router = Router();

// for /cuisine-supplier/...

router.get(
  '/:cuisineId',
  catchExceptions(
    cuisineSupplierController.viewCuisineSuppliersByCuisineId
  )
);