const { Router } = require('express');

const ingredientTypeController = require('../controllers/ingredientType');

const router = Router();

// /v1/... ?

// for /ingredient-type/...

router.get(
  '/',
  /* some validation, */
  catchExceptions(ingredientTypeController.viewAllIngredientTypes)
);

router.get(
  '/:ingredientTypeId',
  /* some validation, */
  catchExceptions(ingredientTypeController.viewIngredientTypeById)
);

module.exports = router;