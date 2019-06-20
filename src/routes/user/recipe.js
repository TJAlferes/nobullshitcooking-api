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
  catchExceptions(userRecipeController.createRecipe)
);

router.put(
  '/update/:recipeId',
  userIsAuth,
  /*isValid,*/
  catchExceptions(userRecipeController.updateRecipe)
);

router.delete(
  '/delete/:recipeId',
  userIsAuth,
  catchExceptions(userRecipeController.deleteRecipe)
);

router.post(
  '/',
  userIsAuth,
  catchExceptions(userRecipeController.viewRecipe)
);

router.get(
  '/:recipeId',
  userIsAuth,
  catchExceptions(userRecipeController.viewRecipeDetail)
);

module.exports = router;