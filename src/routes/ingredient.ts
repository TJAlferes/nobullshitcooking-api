import { Router } from 'express';

const catchExceptions = require('../lib/utils/catchExceptions');
const ingredientController = require('../controllers/ingredient');

export const router = Router();

// /v1/... ?

// for /ingredient/...

router.get(
  '/official/all',
  catchExceptions(ingredientController.viewAllOfficialIngredients)
);

router.get(
  '/:ingredientId',
  catchExceptions(ingredientController.viewIngredientDetail)
);