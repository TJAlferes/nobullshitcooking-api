import { Router } from 'express';

import { cuisineSupplierController } from '../controllers/cuisineSupplier';
import { catchExceptions } from '../lib/utils/catchExceptions';

export const router = Router();

// /v1/... ?

// for /cuisine-supplier/...

router.get(
  '/',
  catchExceptions(
    cuisineSupplierController.viewCuisineSuppliersByCuisineId
  )
);