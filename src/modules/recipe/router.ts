import { Router } from 'express';
import { param }  from 'express-validator';  // query ?

import { RecipeController } from './controller';
import { catchExceptions }  from '../../utils';

const router = Router();

// for /recipe/...

export function recipeRouter() {
  const controller = new RecipeController();

  //router.get('/', catchExceptions(controller.viewAll));  // remove ? you need these for the planner
  router.get('/titles', catchExceptions(controller.viewAllPublicTitles));

  router.get(
    '/:title',
    [param('title').not().isEmpty().trim().escape()],
    catchExceptions(controller.viewOneByTitle)
  );

  return router;
}
