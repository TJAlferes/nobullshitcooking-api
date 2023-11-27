import { Router } from 'express';
import { param } from 'express-validator';

import { catchExceptions } from '../../utils';
import { recipeController as controller } from './controller';

const router = Router();

// for /recipes

export function recipeRouter() {
  router.get('/titles', catchExceptions(controller.viewAllOfficialTitles));

  router.get(
    '/:title',
    [param('title').not().isEmpty().trim().escape()],
    catchExceptions(controller.viewOneByTitle)
  );  // not needed???

  return router;
}
