const { Router } = require('express');

const userIsAuth = require('../../lib/utils/userIsAuth');
const catchExceptions = require('../../lib/utils/catchExceptions');
const userIngredientController = require('../../controllers/user/ingredient');

const router = Router();

// /v1/... ?

// for /user/ingredient/...

router.post(
  '/create',
  userIsAuth,
  /*isValid,*/
  catchExceptions(userIngredientController.createIngredient)
);

router.put(
  '/update/:ingredientId',
  userIsAuth,
  /*isValid,*/
  catchExceptions(userIngredientController.updateIngredient)
);

router.delete(
  '/delete/:ingredientId',
  userIsAuth,
  catchExceptions(userIngredientController.deleteIngredient)
);

router.post(
  '/',
  userIsAuth,
  catchExceptions(userIngredientController.viewIngredient)
);

router.get(
  '/:ingredientId',
  userIsAuth,
  catchExceptions(userIngredientController.viewIngredientDetail)
);

module.exports = router;