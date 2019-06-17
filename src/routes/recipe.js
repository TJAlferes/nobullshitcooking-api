const { Router } = require('express');

const catchExceptions = require('../lib/utils/catchExceptions');
const recipeController = require('../controllers/recipe');

const router = Router();

// /v1/... ?

// for /recipe/...

router.post(
  '/',
  catchExceptions(recipeController.viewRecipe)
);

router.post(
  '/titles',
  catchExceptions(recipeController.viewRecipeTitlesByIds)
);

router.get(
  '/:recipeId',
  catchExceptions(recipeController.viewRecipeDetail)
);

module.exports = router;