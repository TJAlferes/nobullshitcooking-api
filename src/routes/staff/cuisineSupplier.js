const { Router } = require('express');

const catchExceptions = require('../../lib/utils/catchExceptions');
const staffIsAuth = require('../../lib/utils/staffIsAuth');

const staffCuisineSupplierController = require(
  '../../controllers/staff/cuisineSupplier'
);

const router = Router();

// /v1/... ?

// for /staff/cuisine-supplier/...

router.post(
  '/',
  staffIsAuth,
  catchExceptions(
    staffCuisineSupplierController.viewCuisineSuppliersByCuisineId
  )
);

router.post(
  '/create',
  staffIsAuth,
  catchExceptions(
    staffCuisineSupplierController.createCuisineSupplier
  )
);

router.delete(
  '/delete',
  staffIsAuth,
  catchExceptions(
    staffCuisineSupplierController.deleteCuisineSupplier
  )
);