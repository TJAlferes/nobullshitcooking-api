import { Router } from 'express';
import { param } from 'express-validator';

import { cuisineIngredientController } from '../controllers/cuisineIngredient';
import { catchExceptions } from '../lib/utils/catchExceptions';

export const router = Router();

// for /cuisine-ingredient/...

router.get(
  '/:id',
  [param('id').not().isEmpty().trim().escape()],
  catchExceptions(cuisineIngredientController.viewByCuisineId)
);