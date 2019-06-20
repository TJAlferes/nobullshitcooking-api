const { Router } = require('express');

const staffIsAuth = require('../../lib/utils/staffIsAuth');
const catchExceptions = require('../../lib/utils/catchExceptions');
const staffRecipeController = require('../../controllers/staff/recipe');

const router = Router();

// /v1/... ?

// for /staff/recipe/...

router.post(
  '/create',
  staffIsAuth,
  /*isValid,*/
  catchExceptions(staffRecipeController.createRecipe)
);

router.put(
  '/update/:recipeId',
  staffIsAuth,
  /*isValid,*/
  catchExceptions(staffRecipeController.updateRecipe)
);

router.delete(
  '/delete/:recipeId',
  staffIsAuth,
  catchExceptions(staffRecipeController.deleteRecipe)
);

module.exports = router;