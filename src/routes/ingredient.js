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
  '/:ingredientId',
  /* some validation, */
  catchExceptions(ingredientController.viewIngredientDetail)
);

router.post(
  '/create',
  /* some validation, */
  catchExceptions(ingredientController.createIngredient)
);

router.put(
  '/update',
  /* some validation, */
  catchExceptions(ingredientController.updateIngredient)
);

router.delete(
  '/delete',
  /* some validation, */
  catchExceptions(ingredientController.deleteIngredient)
);

module.exports = router;