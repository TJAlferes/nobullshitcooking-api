import { Router } from 'express';
import { body } from 'express-validator';

import { staffSupplierController } from '../../controllers/staff/supplier';
import { catchExceptions } from '../../lib/utils/catchExceptions';
import { staffIsAuth } from '../../lib/utils/staffIsAuth';

export const router = Router();

// /v1/... ?

// for /staff/supplier/...

router.post(
  '/',
  staffIsAuth,
  [body('supplierId').not().isEmpty().trim().escape()],
  catchExceptions(staffSupplierController.viewSupplierById)
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