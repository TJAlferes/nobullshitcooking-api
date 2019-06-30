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
  catchExceptions(userIngredientController.createUserIngredient)
);

router.put(
  '/update/:ingredientId',
  userIsAuth,
  /*isValid,*/
  catchExceptions(userIngredientController.updateUserIngredient)
);

router.delete(
  '/delete/:ingredientId',
  userIsAuth,
  catchExceptions(userIngredientController.deleteUserIngredient)
);

router.post(
  '/',
  userIsAuth,
  catchExceptions(userIngredientController.viewUserIngredient)
);

router.get(
  '/:ingredientId',
  userIsAuth,
  catchExceptions(userIngredientController.viewUserIngredientDetail)
);

module.exports = router;