import { Router } from 'express';
import { param }  from 'express-validator';

import { catchExceptions }      from '../../utils/index.js';
import { ingredientController } from './controller.js';

const router = Router();

// for /ingredients

export function ingredientRouter() {
  router.get(
    '/:ingredient_id',
    [param('ingredient_id').not().isEmpty().trim().escape()],
    catchExceptions(ingredientController.viewOne)
  );

  router.get('/', catchExceptions(ingredientController.viewAll));

  return router;
}
