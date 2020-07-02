import { Router } from 'express';

import { cuisineIngredientController } from '../controllers/cuisineIngredient';
import { catchExceptions } from '../lib/utils/catchExceptions';

export const router = Router();

// for /cuisine-ingredient/...

router.get(
  '/',
  catchExceptions(
    cuisineIngredientController.viewCuisineIngredientsByCuisineId
  )
);