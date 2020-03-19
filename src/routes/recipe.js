const { Router } = require('express');

const catchExceptions = require('../lib/utils/catchExceptions');
const recipeController = require('../controllers/recipe');

const router = Router();

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

module.exports = router;