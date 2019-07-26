const { Router } = require('express');

const userIsAuth = require('../../lib/utils/userIsAuth');
const catchExceptions = require('../../lib/utils/catchExceptions');
const userFavoriteRecipeController = require('../../controllers/user/favoriteRecipe');

const router = Router();

// /v1/... ?

// for /user/favorite-recipe/...

router.post(
  '/',
  userIsAuth,
  catchExceptions(userFavoriteRecipeController.viewMyFavoriteRecipes)
);

router.post(
  '/create',
  userIsAuth,
  catchExceptions(userFavoriteRecipeController.createMyFavoriteRecipe)
);

router.delete(
  '/delete',
  userIsAuth,
  catchExceptions(userFavoriteRecipeController.deleteMyFavoriteRecipe)
);

module.exports = router;