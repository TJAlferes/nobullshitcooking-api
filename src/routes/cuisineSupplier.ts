const { Router } = require('express');

const catchExceptions = require('../lib/utils/catchExceptions');

const cuisineSupplierController = require('../controllers/cuisineSupplier');

const router = Router();

// /v1/... ?

// for /cuisine-supplier/...

router.get(
  '/',
  catchExceptions(
    cuisineSupplierController.viewCuisineSuppliersByCuisineId
  )
);

module.exports = router;