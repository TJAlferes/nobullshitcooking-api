import { Router } from 'express';
import { body } from 'express-validator';
import { Pool } from 'mysql2/promise';

import {
  StaffCuisineIngredientController
} from '../../controllers/staff/cuisineIngredient';
import { catchExceptions } from '../../lib/utils/catchExceptions';
import { staffIsAuth } from '../../lib/utils/staffIsAuth';

const router = Router();

// for /staff/cuisine-ingredient/...

export function staffCuisineIngredientRouter(pool: Pool) {
  const controller = new StaffCuisineIngredientController(pool);

  router.post(
    '/create',
    staffIsAuth,
    [
      body('cuisineId').not().isEmpty().trim().escape(),
      body('ingredientId').not().isEmpty().trim().escape()
    ],
    catchExceptions(controller.create)
  );

  router.delete(
    '/delete',
    staffIsAuth,
    [
      body('cuisineId').not().isEmpty().trim().escape(),
      body('ingredientId').not().isEmpty().trim().escape()
    ],
    catchExceptions(controller.delete)
  );

  return router;
}