import { Router } from 'express';
import { param }  from 'express-validator';  // query ?
import { Pool }   from 'mysql2/promise';

import { RecipeController } from '../controllers';
import { catchExceptions }  from '../lib/utils';

const router = Router();

// for /recipe/...

export function recipeRouter(pool: Pool) {
  const controller = new RecipeController(pool);

  //router.get('/', catchExceptions(controller.viewAll));  // remove ? you need these for the planner
  router.get('/titles', catchExceptions(controller.viewTitles));
  router.get('/:title', [param('title').not().isEmpty().trim().escape()], catchExceptions(controller.viewOne));

  return router;
}
