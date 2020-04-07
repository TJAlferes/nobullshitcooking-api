import { Router } from 'express';

const catchExceptions = require('../lib/utils/catchExceptions');

const cuisineSupplierController = require('../controllers/cuisineSupplier');

export const router = Router();

// /v1/... ?

// for /cuisine-supplier/...

router.get(
  '/',
  catchExceptions(
    cuisineSupplierController.viewCuisineSuppliersByCuisineId
  )
);