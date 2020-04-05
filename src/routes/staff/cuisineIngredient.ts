const { Router } = require('express');

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
  catchExceptions(
    staffCuisineIngredientController.createCuisineIngredient
  )
);

router.delete(
  '/delete',
  staffIsAuth,
  catchExceptions(
    staffCuisineIngredientController.deleteCuisineIngredient
  )
);

module.exports = router;