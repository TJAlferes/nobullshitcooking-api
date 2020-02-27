const { Router } = require('express');

const catchExceptions = require('../lib/utils/catchExceptions');

const cuisineIngredientController = require('../controllers/cuisineIngredient');

const router = Router();

// /v1/... ?

// for /cuisine-ingredient/...

router.get(
  '/',
  catchExceptions(
    cuisineIngredientController.viewCuisineIngredientsByCuisineId
  )
);

module.exports = router;