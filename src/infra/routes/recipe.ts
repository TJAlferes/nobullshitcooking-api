import { Router } from 'express';
import { param }  from 'express-validator';  // query ?

import { RecipeController } from '../controllers';
import { catchExceptions }  from '../lib/utils';

const router = Router();

// for /recipe/...

export function recipeRouter() {
  const controller = new RecipeController();

  //router.get('/', catchExceptions(controller.viewAll));  // remove ? you need these for the planner
  router.get('/titles', catchExceptions(controller.viewTitles));
  router.get('/:title', [param('title').not().isEmpty().trim().escape()], catchExceptions(controller.viewOne));

  return router;
}
