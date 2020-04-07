import { Router } from 'express';
import { body } from 'express-validator';

const catchExceptions = require('../../lib/utils/catchExceptions');
const staffIsAuth = require('../../lib/utils/staffIsAuth');

const staffCuisineSupplierController = require(
  '../../controllers/staff/cuisineSupplier'
);

export const router = Router();

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
  [body('supplierId').not().isEmpty().trim().escape()],
  catchExceptions(
    staffCuisineSupplierController.createCuisineSupplier
  )
);

router.delete(
  '/delete',
  staffIsAuth,
  [
    body('cuisineId').not().isEmpty().trim().escape(),
    body('supplierId').not().isEmpty().trim().escape()
  ],
  catchExceptions(
    staffCuisineSupplierController.deleteCuisineSupplier
  )
);