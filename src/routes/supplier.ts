import { Router } from 'express';
import { param } from 'express-validator';

import { supplierController } from '../controllers/supplier';
import { catchExceptions } from '../lib/utils/catchExceptions';

export const router = Router();

// for /supplier/...

router.get(
  '/',
  catchExceptions(supplierController.view)
);

router.get(
  '/:id',
  [param('id').not().isEmpty().trim().escape()],
  catchExceptions(supplierController.viewById)
);