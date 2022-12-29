import { Router } from 'express';
import { body } from 'express-validator';
import { Pool } from 'mysql2/promise';

import { StaffSupplierController } from '../../controllers/staff';
import { catchExceptions, staffIsAuth } from '../../lib/utils';

const router = Router();

// for /staff/supplier/...

export function staffSupplierRouter(pool: Pool) {
  const controller = new StaffSupplierController(pool);

  router.post('/create', staffIsAuth, [body('name').not().isEmpty().trim().escape()], catchExceptions(controller.create));
  
  router.put('/update', staffIsAuth, [
    body('id').not().isEmpty().trim().escape(),
    body('name').not().isEmpty().trim().escape()
  ], catchExceptions(controller.update));
  
  router.delete('/delete', staffIsAuth, [body('id').not().isEmpty().trim().escape()], catchExceptions(controller.delete));

  return router;
}