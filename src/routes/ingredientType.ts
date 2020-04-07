import { Router } from 'express';

const catchExceptions = require('../lib/utils/catchExceptions');
const ingredientTypeController = require('../controllers/ingredientType');

export const router = Router();

// /v1/... ?

// for /ingredient-type/...

router.get(
  '/',
  catchExceptions(ingredientTypeController.viewAllIngredientTypes)
);

router.get(
  '/:ingredientTypeId',
  catchExceptions(ingredientTypeController.viewIngredientTypeById)
);