const { Router } = require('express');

const ingredientController = require('../controllers/ingredient');

const router = Router();

// /v1/... ?

// for /ingredient/...

router.post(
  '/',
  /* some validation, */
  catchExceptions(ingredientController.viewIngredients)
);

router.get(
  '/:ingredientId',
  /* some validation, */
  catchExceptions(ingredientController.viewIngredientDetail)
);

module.exports = router;