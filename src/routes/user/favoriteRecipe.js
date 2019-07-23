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
  catchExceptions(userFavoriteRecipeController.viewFavoriteRecipes)
);

router.post(
  '/create',
  userIsAuth,
  catchExceptions(userFavoriteRecipeController.createFavoriteRecipe)
);

router.delete(
  '/delete',
  userIsAuth,
  catchExceptions(userFavoriteRecipeController.deleteFavoriteRecipe)
);

module.exports = router;