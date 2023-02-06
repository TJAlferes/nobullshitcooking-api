import { Router } from 'express';
import { Pool } from 'mysql2/promise';

import { staffAuthRouter } from './auth';
//import { staffOrderRouter } from './order';
//import { staffProductRouter } from './product';
import { staffSupplierRouter } from './supplier';

const router = Router();

export function staffRouter(pool: Pool) {
  router.use('/auth',       staffAuthRouter(pool));
  //router.use('/order', staffRouter(pool));
  //router.use('/product', staffRouter(pool));
  router.use('/supplier',   staffSupplierRouter(pool));

  return router;
}