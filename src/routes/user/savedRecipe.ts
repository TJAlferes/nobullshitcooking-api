import { Router } from 'express';
import { body } from 'express-validator';

const userIsAuth = require('../../lib/utils/userIsAuth');
const catchExceptions = require('../../lib/utils/catchExceptions');
const userSavedRecipeController = require('../../controllers/user/savedRecipe');

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