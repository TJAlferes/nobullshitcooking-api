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
  catchExceptions(userSavedRecipeController.viewByUserId)
);

router.post(
  '/create',
  userIsAuth,
  [body('id').not().isEmpty().trim().escape()],
  catchExceptions(userSavedRecipeController.create)
);

router.delete(
  '/delete',
  userIsAuth,
  [body('id').not().isEmpty().trim().escape()],
  catchExceptions(userSavedRecipeController.delete)
);