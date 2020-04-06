const { Router } = require('express');
import { body } from 'express-validator';

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
  [body('ingredientId').not().isEmpty().trim().escape()],
  catchExceptions(userIngredientController.viewMyPrivateUserIngredient)
);

router.post(
  '/create',
  userIsAuth,
  [
    body('ingredientTypeId').not().isEmpty().trim().escape(),
    body('ingredientName').not().isEmpty().trim().escape(),
    body('ingredientDescription').not().isEmpty().trim().escape(),
    body('ingredientImage').not().isEmpty().trim().escape()
  ],
  catchExceptions(userIngredientController.createMyPrivateUserIngredient)
);

router.put(
  '/update',
  userIsAuth,
  [
    body('ingredientId').not().isEmpty().trim().escape(),
    body('ingredientTypeId').not().isEmpty().trim().escape(),
    body('ingredientName').not().isEmpty().trim().escape(),
    body('ingredientDescription').not().isEmpty().trim().escape(),
    body('ingredientImage').not().isEmpty().trim().escape()
  ],
  catchExceptions(userIngredientController.updateMyPrivateUserIngredient)
);

router.delete(
  '/delete',
  userIsAuth,
  [body('ingredientId').not().isEmpty().trim().escape()],
  catchExceptions(userIngredientController.deleteMyPrivateUserIngredient)
);

module.exports = router;