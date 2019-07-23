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
  catchExceptions(userSavedRecipeController.viewSavedRecipes)
);

router.post(
  '/create',
  userIsAuth,
  catchExceptions(userSavedRecipeController.createSavedRecipe)
);

router.delete(
  '/delete',
  userIsAuth,
  catchExceptions(userSavedRecipeController.deleteSavedRecipe)
);

module.exports = router;