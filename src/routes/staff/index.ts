import { Router } from 'express';
import { Pool } from 'mysql2/promise';
import { Client } from '@elastic/elasticsearch';

import { staffAuthRouter } from './auth';
import { staffEquipmentRouter } from './equipment';
import { staffGetSignedUrlRouter } from './get-signed-url';
import { staffIngredientRouter } from './ingredient';
import { staffRecipeRouter } from './recipe';
import { staffSupplierRouter } from './supplier';

const router = Router();

export function staffRouter(esClient: Client, pool: Pool) {
  const staffAuthRoutes =         staffAuthRouter(pool);
  const staffEquipmentRoutes =    staffEquipmentRouter(esClient, pool);
  const staffGetSignedUrlRoutes = staffGetSignedUrlRouter();
  const staffIngredientRoutes =   staffIngredientRouter(esClient, pool);
  const staffRecipeRoutes =       staffRecipeRouter(esClient, pool);
  const staffSupplierRoutes =     staffSupplierRouter(pool);

  router.use('/auth',                   staffAuthRoutes);
  router.use('/equipment',              staffEquipmentRoutes);
  router.use('/get-signed-url/content', staffGetSignedUrlRoutes);
  router.use('/ingredient',             staffIngredientRoutes);
  router.use('/recipe',                 staffRecipeRoutes);
  router.use('/supplier',               staffSupplierRoutes);

  return router;
}