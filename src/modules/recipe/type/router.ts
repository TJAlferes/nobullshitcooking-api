import { Router } from 'express';
import { param }  from 'express-validator';

import { RecipeTypeController } from './controller';
import { catchExceptions }      from '../../../utils';

const router = Router();

// for /recipe-type/...

export function recipeTypeRouter() {
  const controller = new RecipeTypeController();

  router.get('/', catchExceptions(controller.viewAll));

  router.get(
    '/:recipe_type_id',
    [param('recipe_type_id').not().isEmpty().trim().escape()],
    catchExceptions(controller.viewOne)
  );

  return router;
}
