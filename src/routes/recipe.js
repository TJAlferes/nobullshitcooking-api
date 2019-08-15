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

router.get(
  '/official/all',
  catchExceptions(recipeController.viewAllOfficialRecipes)
);

router.get(
  '/public/all',
  catchExceptions(recipeController.viewAllPublicRecipes)
);

router.get(
  '/:recipeId',
  catchExceptions(recipeController.viewRecipeDetail)
);

// YOU CAN REMOVE THIS NOW
router.post(
  '/titles',
  catchExceptions(recipeController.viewRecipeTitlesByIds)
);

module.exports = router;