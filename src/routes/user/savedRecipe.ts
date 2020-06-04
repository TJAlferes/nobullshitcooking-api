import { Router } from 'express';
import { body } from 'express-validator';

import { userSavedRecipeController } from '../../controllers/user/savedRecipe';
import { catchExceptions } from '../../lib/utils/catchExceptions';
import { userIsAuth } from '../../lib/utils/userIsAuth';

export const router = Router();

// /v1/... ?

// for /user/saved-recipe/...

router.post(
  '/',
  userIsAuth,
  catchExceptions(userSavedRecipeController.viewMySavedRecipes)
);

router.post(
  '/create',
  userIsAuth,
  [body('userId').not().isEmpty().trim().escape()],
  catchExceptions(userSavedRecipeController.createMySavedRecipe)
);

router.delete(
  '/delete',
  userIsAuth,
  [body('userId').not().isEmpty().trim().escape()],
  catchExceptions(userSavedRecipeController.deleteMySavedRecipe)
);