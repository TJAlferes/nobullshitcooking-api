import { Router } from 'express';
import { body } from 'express-validator';

import { userIsAuth } from '../../../lib/utils/userIsAuth';
import { catchExceptions } from '../../../lib/utils/catchExceptions';
import { getSignedUrlRecipeIngredients } from '../../../controllers/user/get-signed-url/recipeIngredients';

export const router = Router();

// /v1/... ?

// for /user/get-signed-url/recipe-ingredients/...

router.post(
  '/',
  userIsAuth,
  [body('fileType').not().isEmpty().trim().escape()],
  catchExceptions(getSignedUrlRecipeIngredients)
);