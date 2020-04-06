const { Router } = require('express');
import { body } from 'express-validator';

const catchExceptions = require('../../lib/utils/catchExceptions');
const staffIsAuth = require('../../lib/utils/staffIsAuth');

const staffSupplierController = require(
  '../../controllers/staff/supplier'
);

const router = Router();

// /v1/... ?

// for /staff/supplier/...

router.post(
  '/',
  staffIsAuth,
  [body('supplierId').not().isEmpty().trim().escape()],
  catchExceptions(staffSupplierController.viewSuppliersById)
);

router.post(
  '/all',
  staffIsAuth,
  catchExceptions(staffSupplierController.viewAllSuppliers)
);

router.post(
  '/create',
  staffIsAuth,
  [body('supplierName').not().isEmpty().trim().escape()],
  catchExceptions(staffSupplierController.createSupplier)
);

router.put(
  '/update',
  staffIsAuth,
  [
    body('supplierId').not().isEmpty().trim().escape(),
    body('supplierName').not().isEmpty().trim().escape()
  ],
  catchExceptions(staffSupplierController.updateSupplier)
);

router.delete(
  '/delete',
  staffIsAuth,
  [body('supplierId').not().isEmpty().trim().escape()],
  catchExceptions(staffSupplierController.deleteSupplier)
);

module.exports = router;