import { Router } from 'express';

import { router as userAuthRouter } from './auth';
import { router as userEquipmentRouter } from './equipment';
import { router as userFavoriteRecipeRouter } from './favoriteRecipe';
import { router as userFriendshipRouter } from './friendship';
import { router as userGetSignedUrlRouter } from './get-signed-url';
import { router as userIngredientRouter } from './ingredient';
import { router as userPlanRouter } from './plan';
//import { router as userProfileRouter } from './profile';
import { router as userRecipeRouter } from './recipe';
import { router as userSavedRecipeRouter } from './savedRecipe';

export const router = Router();

router.use('/auth', userAuthRouter);
router.use('/equipment', userEquipmentRouter);
router.use('/favorite-recipe', userFavoriteRecipeRouter);
router.use('/friendship', userFriendshipRouter);
router.use('/get-signed-url', userGetSignedUrlRouter);
router.use('/ingredient', userIngredientRouter);
router.use('/plan', userPlanRouter);
//router.use('/profile', userProfileRouter);
router.use('/recipe', userRecipeRouter);
router.use('/saved-recipe', userSavedRecipeRouter);