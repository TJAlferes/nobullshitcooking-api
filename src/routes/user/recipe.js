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
  /*isValid,*/
  catchExceptions(userRecipeController.createUserRecipe)
);

router.put(
  '/update/:recipeId',
  userIsAuth,
  /*isValid,*/
  catchExceptions(userRecipeController.updateUserRecipe)
);

router.delete(
  '/delete/:recipeId',
  userIsAuth,
  catchExceptions(userRecipeController.deleteUserRecipe)
);

router.post(
  '/',
  userIsAuth,
  catchExceptions(userRecipeController.viewUserRecipe)
);

router.get(
  '/:recipeId',
  userIsAuth,
  catchExceptions(userRecipeController.viewUserRecipeDetail)
);

module.exports = router;