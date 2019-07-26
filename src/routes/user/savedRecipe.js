const { Router } = require('express');

const userIsAuth = require('../../lib/utils/userIsAuth');
const catchExceptions = require('../../lib/utils/catchExceptions');
const userSavedRecipeController = require('../../controllers/user/savedRecipe');

const router = Router();

// /v1/... ?

// for /user/saved-recipe/...

router.post(
  '/',
  userIsAuth,
  catchExceptions(userSavedRecipeController.viewMySavedRecipes)
);

router.post(
  '/create',
  userIsAuth,
  catchExceptions(userSavedRecipeController.createMySavedRecipe)
);

router.delete(
  '/delete',
  userIsAuth,
  catchExceptions(userSavedRecipeController.deleteMySavedRecipe)
);

module.exports = router;