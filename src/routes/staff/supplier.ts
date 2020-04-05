const { Router } = require('express');

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
  catchExceptions(staffSupplierController.createSupplier)
);

router.put(
  '/update',
  staffIsAuth,
  catchExceptions(staffSupplierController.updateSupplier)
);

router.delete(
  '/delete',
  staffIsAuth,
  catchExceptions(staffSupplierController.deleteSupplier)
);

module.exports = router;