import { Router } from 'express';
import { body } from 'express-validator';

import { staffSupplierController } from '../../controllers/staff/supplier';
import { catchExceptions } from '../../lib/utils/catchExceptions';
import { staffIsAuth } from '../../lib/utils/staffIsAuth';

export const router = Router();

// for /staff/supplier/...

router.post(
  '/create',
  staffIsAuth,
  [body('name').not().isEmpty().trim().escape()],
  catchExceptions(staffSupplierController.create)
);

router.put(
  '/update',
  staffIsAuth,
  [
    body('id').not().isEmpty().trim().escape(),
    body('name').not().isEmpty().trim().escape()
  ],
  catchExceptions(staffSupplierController.update)
);

router.delete(
  '/delete',
  staffIsAuth,
  [body('id').not().isEmpty().trim().escape()],
  catchExceptions(staffSupplierController.delete)
);