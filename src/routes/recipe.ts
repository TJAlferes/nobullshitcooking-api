import { Router } from 'express';

import { recipeController } from '../controllers/recipe';
import { catchExceptions } from '../lib/utils/catchExceptions';

export const router = Router();

// for /recipe/...

router.get(
  '/official/all',
  catchExceptions(recipeController.view)
);

router.get(
  '/:id',
  catchExceptions(recipeController.viewById)
);