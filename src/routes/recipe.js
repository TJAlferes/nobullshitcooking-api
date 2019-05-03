const { Router } = require('express');

const catchExceptions = require('../lib/utils/catchExceptions');
const recipeController = require('../controllers/recipe');

const router = Router();

// /v1/... ?

// for /recipe/...

router.get(
  '/',
  /* some validation, */
  catchExceptions(recipeController.viewRecipe)
);

router.get(
  '/:recipeId',
  /* some validation, */
  catchExceptions(recipeController.viewRecipeDetail)
);

/*


router.post(
  '/create',
  //some validation,
  catchExceptions(recipeController.createRecipe)
);

router.put(
  '/update',
  //some validation
  catchExceptions(recipeController.updateRecipe)
);

router.delete(
  '/delete',
  // some validation
  catchExceptions(recipeController.deleteRecipe)
);


*/

module.exports = router;