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
  catchExceptions(userIngredientController.createIngredient)
);

router.put(
  '/update/:ingredientId',
  userIsAuth,
  catchExceptions(userIngredientController.updateIngredient)
);

router.delete(
  '/delete/private/:ingredientId',
  userIsAuth,
  catchExceptions(userIngredientController.deleteMyPrivateUserIngredient)
);

router.post(
  '/private',
  userIsAuth,
  catchExceptions(userIngredientController.viewAllMyPrivateUserIngredients)
);

router.get(
  '/private/:ingredientId',
  userIsAuth,
  catchExceptions(userIngredientController.viewMyPrivateUserIngredient)
);

module.exports = router;