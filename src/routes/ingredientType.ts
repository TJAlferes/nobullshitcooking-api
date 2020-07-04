import { Router } from 'express';

import { ingredientTypeController } from '../controllers/ingredientType';
import { catchExceptions } from '../lib/utils/catchExceptions';

export const router = Router();

// for /ingredient-type/...

router.get(
  '/',
  catchExceptions(ingredientTypeController.viewIngredientTypes)
);

router.get(
  '/:ingredientTypeId',
  catchExceptions(ingredientTypeController.viewIngredientTypeById)
);