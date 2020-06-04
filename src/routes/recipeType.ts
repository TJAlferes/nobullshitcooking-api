import { Router } from 'express';

import { recipeTypeController } from '../controllers/recipeType';
import { catchExceptions } from '../lib/utils/catchExceptions';

export const router = Router();

// /v1/... ?

// for /recipe-type/...

router.get(
  '/',
  catchExceptions(recipeTypeController.viewRecipeTypes)
);

router.get(
  '/:recipeTypeId',
  catchExceptions(recipeTypeController.viewRecipeTypeById)
);