import { Router } from 'express';
import { param }  from 'express-validator';

import { recipeController as controller } from './controller.js';
import { catchExceptions } from '../../index.js';

const router = Router();

// for /recipes

export function recipeRouter() {
  router.get('/titles', catchExceptions(controller.viewAllOfficialTitles));

  router.get(
    '/:title',
    [param('title').not().isEmpty().trim().escape()],
    catchExceptions(controller.viewOneByTitle)
  );

  return router;
}
