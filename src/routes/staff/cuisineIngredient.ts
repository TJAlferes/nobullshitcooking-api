import { Router } from 'express';
import { body } from 'express-validator';

import {
  staffCuisineIngredientController
} from '../../controllers/staff/cuisineIngredient';
import { catchExceptions } from '../../lib/utils/catchExceptions';
import { staffIsAuth } from '../../lib/utils/staffIsAuth';

export const router = Router();

// for /staff/cuisine-ingredient/...

router.post(
  '/create',
  staffIsAuth,
  [
    body('cuisineId').not().isEmpty().trim().escape(),
    body('ingredientId').not().isEmpty().trim().escape()
  ],
  catchExceptions(staffCuisineIngredientController.create)
);

router.delete(
  '/delete',
  staffIsAuth,
  [
    body('cuisineId').not().isEmpty().trim().escape(),
    body('ingredientId').not().isEmpty().trim().escape()
  ],
  catchExceptions(staffCuisineIngredientController.delete)
);