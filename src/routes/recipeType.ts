import { Router } from 'express';
import { param } from 'express-validator';

import { recipeTypeController } from '../controllers/recipeType';
import { catchExceptions } from '../lib/utils/catchExceptions';

export const router = Router();

// for /recipe-type/...

router.get(
  '/',
  catchExceptions(recipeTypeController.view)
);

router.get(
  '/:id',
  [param('id').not().isEmpty().trim().escape()],
  catchExceptions(recipeTypeController.viewById)
);