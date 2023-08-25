import { Router } from 'express';
import { param }  from 'express-validator';

import { ingredientController } from './controller';
import { catchExceptions }      from '../../utils';

const router = Router();

// for /ingredient/...

export function ingredientRouter() {
  router.get('/', catchExceptions(ingredientController.viewAll));

  router.get(
    '/:ingredient_id',
    [param('ingredient_id').not().isEmpty().trim().escape()],
    catchExceptions(ingredientController.viewOne)
  );

  return router;
}
