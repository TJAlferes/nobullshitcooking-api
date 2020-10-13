import { Router } from 'express';
import { Pool } from 'mysql2/promise';
import { Client } from '@elastic/elasticsearch';

import { userAuthRouter } from './auth';
import { userEquipmentRouter } from './equipment';
import { userFavoriteRecipeRouter } from './favoriteRecipe';
import { userFriendshipRouter } from './friendship';
import { userGetSignedUrlRouter } from './get-signed-url';
import { userIngredientRouter } from './ingredient';
import { userPlanRouter } from './plan';
//import { userProfileRouter } from './profile';
import { userRecipeRouter } from './recipe';
import { userSavedRecipeRouter } from './savedRecipe';

const router = Router();

export function userRouter(esClient: Client, pool: Pool) {
  const userAuthRoutes = userAuthRouter(pool);
  const userEquipmentRoutes = userEquipmentRouter(pool);
  const userFavoriteRecipeRoutes = userFavoriteRecipeRouter(pool);
  const userFriendshipRoutes = userFriendshipRouter(pool);
  const userGetSignedUrlRoutes = userGetSignedUrlRouter();
  const userIngredientRoutes = userIngredientRouter(pool);
  const userPlanRoutes = userPlanRouter(pool);
  //const userProfileRoutes = userProfileRouter(pool);
  const userRecipeRoutes = userRecipeRouter(esClient, pool);
  const userSavedRecipeRoutes = userSavedRecipeRouter(pool);

  router.use('/auth', userAuthRoutes);
  router.use('/equipment', userEquipmentRoutes);
  router.use('/favorite-recipe', userFavoriteRecipeRoutes);
  router.use('/friendship', userFriendshipRoutes);
  router.use('/get-signed-url', userGetSignedUrlRoutes);
  router.use('/ingredient', userIngredientRoutes);
  router.use('/plan', userPlanRoutes);
  //router.use('/profile', userProfileRoutes);
  router.use('/recipe', userRecipeRoutes);
  router.use('/saved-recipe', userSavedRecipeRoutes);

  return router;
}