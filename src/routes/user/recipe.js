const { Router } = require('express');

const userIsAuth = require('../../lib/utils/userIsAuth');
const catchExceptions = require('../../lib/utils/catchExceptions');
const userRecipeController = require('../../controllers/user/recipe');

const router = Router();

// /v1/... ?

// for /user/recipe/...

router.post(
  '/create',
  userIsAuth,
  catchExceptions(userRecipeController.createRecipe)
);



router.put(
  '/update/private',
  userIsAuth,
  catchExceptions(userRecipeController.updateMyPrivateUserRecipe)
);

router.put(
  '/update/public',
  userIsAuth,
  catchExceptions(userRecipeController.updateMyPublicUserRecipe)
);



router.delete(
  '/delete/private',
  userIsAuth,
  catchExceptions(userRecipeController.deleteMyPrivateUserRecipe)
);

router.delete(
  '/delete/public',
  userIsAuth,
  catchExceptions(userRecipeController.disownMyPublicUserRecipe)
);



router.post(
  '/private',
  userIsAuth,
  catchExceptions(userRecipeController.viewAllMyPrivateUserRecipes)
);

router.post(
  '/public',
  userIsAuth,
  catchExceptions(userRecipeController.viewAllMyPublicUserRecipes)
);

router.post(
  '/private/:recipeId',
  userIsAuth,
  catchExceptions(userRecipeController.viewMyPrivateUserRecipe)
);

router.post(
  '/public/:recipeId',
  userIsAuth,
  catchExceptions(userRecipeController.viewMyPublicUserRecipe)
);

module.exports = router;