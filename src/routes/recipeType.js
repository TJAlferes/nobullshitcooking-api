const { Router } = require('express');

const recipeTypeController = require('../controllers/recipeType');

const router = Router();

// /v1/... ?

// for /recipe-type/...

router.get(
  '/',
  /* some validation, */
  catchExceptions(recipeTypeController.viewAllRecipeTypes)
);

router.get(
  '/:recipeTypeId',
  /* some validation, */
  catchExceptions(recipeTypeController.viewRecipeTypeById)
);

module.exports = router;