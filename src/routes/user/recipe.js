const { Router } = require('express');

const userIsAuth = require('../../lib/utils/userIsAuth');
const catchExceptions = require('../../lib/utils/catchExceptions');
const userRecipeController = require('../../controllers/user/recipe');

const router = Router();

// /v1/... ?

// for /user/recipe/...

router.get(
  '/',
  catchExceptions(userRecipeController.viewRecipes)
);
router.get(
  '/:recipeId',
  catchExceptions(userRecipeController.viewRecipe)
);

router.post(
  '/create',
  userIsAuth,
  /*isValid,*/
  catchExceptions(userRecipeController.createRecipe)
);

router.put(
  '/edit/:recipeId',
  userIsAuth,
  /*isValid,*/
  catchExceptions(userRecipeController.updateRecipe)
);

router.delete(
  '/delete/:recipeId',
  userIsAuth,
  catchExceptions(userRecipeController.deleteRecipe)
);

module.exports = router;