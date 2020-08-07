import { Router } from 'express';
import { param } from 'express-validator';

import { cuisineSupplierController } from '../controllers/cuisineSupplier';
import { catchExceptions } from '../lib/utils/catchExceptions';

export const router = Router();

// for /cuisine-supplier/...

router.get(
  '/:id',
  [param('id').not().isEmpty().trim().escape()],
  catchExceptions(cuisineSupplierController.viewByCuisineId)
);