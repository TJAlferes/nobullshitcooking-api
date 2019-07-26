const { Router } = require('express');

const userIsAuth = require('../../lib/utils/userIsAuth');
const catchExceptions = require('../../lib/utils/catchExceptions');
const userIngredientController = require('../../controllers/user/ingredient');

const router = Router();

// /v1/... ?

// for /user/ingredient/...

router.post(
  '/all',
  userIsAuth,
  catchExceptions(userIngredientController.viewAllMyPrivateUserIngredients)
);

router.post(
  '/one',
  userIsAuth,
  catchExceptions(userIngredientController.viewMyPrivateUserIngredient)
);

router.post(
  '/create',
  userIsAuth,
  catchExceptions(userIngredientController.createMyPrivateUserIngredient)
);

router.put(
  '/update',
  userIsAuth,
  catchExceptions(userIngredientController.updateMyPrivateUserIngredient)
);

router.delete(
  '/delete',
  userIsAuth,
  catchExceptions(userIngredientController.deleteMyPrivateUserIngredient)
);

module.exports = router;