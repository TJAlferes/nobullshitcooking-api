import { Router } from 'express';
import { Pool } from 'mysql2/promise';

import { staffAuthRouter } from './auth';
import { staffContentRouter } from './content';
import { staffCuisineEquipmentRouter } from './cuisineEquipment';
import { staffCuisineIngredientRouter } from './cuisineIngredient';
import { staffCuisineSupplierRouter } from './cuisineSupplier';
import { staffEquipmentRouter } from './equipment';
import { staffGetSignedUrlRouter } from './get-signed-url';
import { staffIngredientRouter } from './ingredient';
import { staffRecipeRouter } from './recipe';
import { staffSupplierRouter } from './supplier';

const router = Router();

export function staffRouter(pool: Pool) {
  const staffAuthRoutes = staffAuthRouter(pool);
  const staffContentRoutes = staffContentRouter(pool);
  const staffCuisineEquipmentRoutes = staffCuisineEquipmentRouter(pool);
  const staffCuisineIngredientRoutes = staffCuisineIngredientRouter(pool);
  const staffCuisineSupplierRoutes = staffCuisineSupplierRouter(pool);
  const staffEquipmentRoutes = staffEquipmentRouter(pool);
  const staffGetSignedUrlRoutes = staffGetSignedUrlRouter();
  const staffIngredientRoutes = staffIngredientRouter(pool);
  const staffRecipeRoutes = staffRecipeRouter(pool);
  const staffSupplierRoutes = staffSupplierRouter(pool);

  router.use('/auth', staffAuthRoutes);
  router.use('/content', staffContentRoutes);
  router.use('/cusine-equipment', staffCuisineEquipmentRoutes);
  router.use('/cusine-ingredient', staffCuisineIngredientRoutes);
  router.use('/cusine-supplier', staffCuisineSupplierRoutes);
  router.use('/equipment', staffEquipmentRoutes);
  router.use('/get-signed-url/content', staffGetSignedUrlRoutes);
  router.use('/ingredient', staffIngredientRoutes);
  router.use('/recipe', staffRecipeRoutes);
  router.use('/supplier', staffSupplierRoutes);

  return router;
}