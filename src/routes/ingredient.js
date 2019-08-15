const { Router } = require('express');

const catchExceptions = require('../lib/utils/catchExceptions');
const ingredientController = require('../controllers/ingredient');

const router = Router();

// /v1/... ?

// for /ingredient/...

router.post(
  '/',
  catchExceptions(ingredientController.viewIngredient)
);

router.get(
  '/official/all',
  catchExceptions(ingredientController.viewAllOfficialIngredients)
);

router.get(
  '/:ingredientId',
  catchExceptions(ingredientController.viewIngredientDetail)
);

module.exports = router;