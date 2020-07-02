import { Router } from 'express';
import { param } from 'express-validator';

import { cuisineController } from '../controllers/cuisine';
import { catchExceptions } from '../lib/utils/catchExceptions';

export const router = Router();

// for /cuisine/...

router.get(
  '/',
  catchExceptions(cuisineController.viewCuisines)
);

router.get(
  '/detail/:cuisineId',
  [param('cuisineId').not().isEmpty().trim().escape()],
  catchExceptions(cuisineController.viewCuisineDetailById)
);

router.get(
  '/:cuisineId',
  [param('cuisineId').not().isEmpty().trim().escape()],
  catchExceptions(cuisineController.viewCuisineById)
);