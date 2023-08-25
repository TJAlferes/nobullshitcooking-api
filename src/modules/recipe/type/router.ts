import { Router } from 'express';
import { param }  from 'express-validator';

import { recipeTypeController as controller } from './controller';
import { catchExceptions } from '../../../utils';

const router = Router();

// for /recipe-type/...

export function recipeTypeRouter() {
  router.get('/', catchExceptions(controller.viewAll));

  router.get(
    '/:recipe_type_id',
    [param('recipe_type_id').not().isEmpty().trim().escape()],
    catchExceptions(controller.viewOne)
  );

  return router;
}
