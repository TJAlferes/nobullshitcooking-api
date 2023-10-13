import { Router } from 'express';
import { param }  from 'express-validator';

import { ingredientTypeController } from './controller.js';
import { catchExceptions }          from '../../../utils/index.js';

const router = Router();

// for /ingredient-types

export function ingredientTypeRouter() {
  router.get('/', catchExceptions(ingredientTypeController.viewAll));

  router.get(
    '/:ingredient_type_id',
    [param('ingredient_type_id').not().isEmpty().trim().escape()],
    catchExceptions(ingredientTypeController.viewOne)
  );

  return router;
}
