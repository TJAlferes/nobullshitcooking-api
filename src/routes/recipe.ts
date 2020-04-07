import { Router } from 'express';

const catchExceptions = require('../lib/utils/catchExceptions');
const recipeController = require('../controllers/recipe');

export const router = Router();

// /v1/... ?

// for /recipe/...

router.get(
  '/official/all',
  catchExceptions(recipeController.viewAllOfficialRecipes)
);

router.get(
  '/:recipeId',
  catchExceptions(recipeController.viewRecipeDetail)
);