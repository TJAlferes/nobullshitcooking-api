const { Router } = require('express');

const recipeController = require('../controllers/recipe');

const router = Router();

// /v1/... ?

// for /recipe/...

router.post(
  '/',
  /* some validation, */
  catchExceptions(recipeController.viewRecipes)
);

router.get(
  '/:recipeId',
  /* some validation, */
  catchExceptions(recipeController.viewRecipeDetail)
);

module.exports = router;