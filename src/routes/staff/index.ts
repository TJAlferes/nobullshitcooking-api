import { Router } from 'express';
import { Pool } from 'mysql2/promise';

import { staffAuthRouter } from './auth';
import { staffEquipmentRouter } from './equipment';
import { staffIngredientRouter } from './ingredient';
import { staffRecipeRouter } from './recipe';
//import { staffSignedUrlRouter } from './signed-url';
import { staffSupplierRouter } from './supplier';

const router = Router();

export function staffRouter(pool: Pool) {
  router.use('/auth',       staffAuthRouter(pool));
  router.use('/equipment',  staffEquipmentRouter(pool));
  router.use('/ingredient', staffIngredientRouter(pool));
  router.use('/recipe',     staffRecipeRouter(pool));
  //router.use('/signed-url', staffSignedUrlRouter());
  router.use('/supplier',   staffSupplierRouter(pool));

  return router;
}