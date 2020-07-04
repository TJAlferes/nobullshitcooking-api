import { Router } from 'express';

import { ingredientController } from '../controllers/ingredient';
import { catchExceptions } from '../lib/utils/catchExceptions';

export const router = Router();

// for /ingredient/...

router.get(
  '/official/all',
  catchExceptions(ingredientController.viewIngredients)
);

router.get(
  '/:ingredientId',
  catchExceptions(ingredientController.viewIngredientById)
);