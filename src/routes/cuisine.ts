const { Router } = require('express');

const catchExceptions = require('../lib/utils/catchExceptions');
const cuisineController = require('../controllers/cuisine');

const router = Router();

// /v1/... ?

// for /cuisine/...

router.get(
  '/',
  catchExceptions(cuisineController.viewAllCuisines)
);

router.get(
  '/detail/:cuisineId',
  catchExceptions(cuisineController.viewCuisineDetailById)
);

router.get(
  '/:cuisineId',
  catchExceptions(cuisineController.viewCuisineById)
);

module.exports = router;