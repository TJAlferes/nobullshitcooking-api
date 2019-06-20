const { Router } = require('express');

const staffIsAuth = require('../../lib/utils/staffIsAuth');
const catchExceptions = require('../../lib/utils/catchExceptions');
const staffIngredientController = require('../../controllers/staff/ingredient');

const router = Router();

// /v1/... ?

// for /staff/ingredient/...

router.post(
  '/create',
  staffIsAuth,
  /*isValid,*/
  catchExceptions(staffIngredientController.createIngredient)
);

router.put(
  '/update/:ingredientId',
  staffIsAuth,
  /*isValid,*/
  catchExceptions(staffIngredientController.updateIngredient)
);

router.delete(
  '/delete/:ingredientId',
  staffIsAuth,
  catchExceptions(staffIngredientController.deleteIngredient)
);

module.exports = router;