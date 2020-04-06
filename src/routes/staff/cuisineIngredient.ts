const { Router } = require('express');
import { body } from 'express-validator';

const catchExceptions = require('../../lib/utils/catchExceptions');
const staffIsAuth = require('../../lib/utils/staffIsAuth');

const staffCuisineIngredientController = require(
  '../../controllers/staff/cuisineIngredient'
);

const router = Router();

// /v1/... ?

// for /staff/cuisine-ingredient/...

router.post(
  '/',
  staffIsAuth,
  catchExceptions(
    staffCuisineIngredientController.viewCuisineIngredientsByCuisineId
  )
);

router.post(
  '/create',
  staffIsAuth,
  [body('ingredientId').not().isEmpty().trim().escape()],
  catchExceptions(
    staffCuisineIngredientController.createCuisineIngredient
  )
);

router.delete(
  '/delete',
  staffIsAuth,
  [
    body('cuisineId').not().isEmpty().trim().escape(),
    body('ingredientId').not().isEmpty().trim().escape()
  ],
  catchExceptions(
    staffCuisineIngredientController.deleteCuisineIngredient
  )
);

module.exports = router;