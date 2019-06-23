const { Router } = require('express');

const userIsAuth = require('../../lib/utils/userIsAuth');
const catchExceptions = require('../../lib/utils/catchExceptions');
const userFavoriteRecipeController = require('../../controllers/user/favoriteRecipe');

const router = Router();

// /v1/... ?

// for /user/favorite-recipe/...

router.get(
  '/',
  userIsAuth,
  /*isValid,*/
  catchExceptions(userFavoriteRecipeController.viewFavoritedByUser)
);

router.post(
  '/create',
  userIsAuth,
  /*isValid,*/
  catchExceptions(userFavoriteRecipeController.createFavoritedByUser)
);

router.delete(
  '/delete',
  userIsAuth,
  /*isValid,*/
  catchExceptions(userFavoriteRecipeController.deleteFavoritedByUser)
);

module.exports = router;