import { Router } from 'express';

const catchExceptions = require('../lib/utils/catchExceptions');

const cuisineIngredientController = require('../controllers/cuisineIngredient');

export const router = Router();

// /v1/... ?

// for /cuisine-ingredient/...

router.get(
  '/',
  catchExceptions(
    cuisineIngredientController.viewCuisineIngredientsByCuisineId
  )
);