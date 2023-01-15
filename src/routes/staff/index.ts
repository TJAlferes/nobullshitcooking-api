import { Router } from 'express';
import { Pool } from 'mysql2/promise';

import { staffAuthRouter } from './auth';
import { staffEquipmentRouter } from './equipment';
import { staffIngredientRouter } from './ingredient';
import { staffRecipeRouter } from './recipe';
import { staffSupplierRouter } from './supplier';

const router = Router();

export function staffRouter(pool: Pool) {
  const staffAuthRoutes =         staffAuthRouter(pool);
  const staffEquipmentRoutes =    staffEquipmentRouter(pool);
  const staffIngredientRoutes =   staffIngredientRouter(pool);
  const staffRecipeRoutes =       staffRecipeRouter(pool);
  const staffSupplierRoutes =     staffSupplierRouter(pool);

  router.use('/auth',                   staffAuthRoutes);
  router.use('/equipment',              staffEquipmentRoutes);
  router.use('/ingredient',             staffIngredientRoutes);
  router.use('/recipe',                 staffRecipeRoutes);
  router.use('/supplier',               staffSupplierRoutes);

  return router;
}