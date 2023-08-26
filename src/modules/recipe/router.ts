import { Router } from 'express';
import { param }  from 'express-validator';  // query ?

import { recipeController as controller } from './controller';
import { catchExceptions } from '../../utils';

const router = Router();

// for /recipe/...

export function recipeRouter() {
  router.get('/titles', catchExceptions(controller.viewAllPublicTitles));

  router.get(
    '/:title',
    [param('title').not().isEmpty().trim().escape()],
    catchExceptions(controller.viewOneByTitle)
  );

  return router;
}
