import { Router } from 'express';
import { param } from 'express-validator';
import { Pool } from 'mysql2/promise';

import { CuisineIngredientController } from '../controllers/cuisineIngredient';
import { catchExceptions } from '../lib/utils/catchExceptions';

const router = Router();

// for /cuisine-ingredient/...

export function cuisineIngredientRouter(pool: Pool) {
  const controller = new CuisineIngredientController(pool);

  router.get(
    '/:id',
    [param('id').not().isEmpty().trim().escape()],
    catchExceptions(controller.viewByCuisineId)
  );

  return router;
}