import { Router } from 'express';

import { router as userGetSignedUrlAvatarRouter } from './get-signed-url/avatar';
import { router as userGetSignedUrlEquipmentRouter } from './get-signed-url/equipment';
import { router as userGetSignedUrlIngredientRouter } from './get-signed-url/ingredient';
import { router as userGetSignedUrlRecipeRouter } from './get-signed-url/recipe';
import { router as userGetSignedUrlRecipeEquipmentRouter } from './get-signed-url/recipeEquipment';
import { router as userGetSignedUrlRecipeIngredientsRouter } from './get-signed-url/recipeIngredients';
import { router as userGetSignedUrlRecipeCookingRouter } from './get-signed-url/recipeCooking';
import { router as userAuthRouter } from './auth';
import { router as userEquipmentRouter } from './equipment';
import { router as userFavoriteRecipeRouter } from './favoriteRecipe';
import { router as userFriendshipRouter } from './friendship';
import { router as userIngredientRouter } from './ingredient';
import { router as userPlanRouter } from './plan';
import { router as userProfileRouter } from './profile';
import { router as userRecipeRouter } from './recipe';
import { router as userSavedRecipeRouter } from './savedRecipe';

export const router = Router();

router.use('/get-signed-url/avatar', userGetSignedUrlAvatarRouter);
router.use('/get-signed-url/equipment', userGetSignedUrlEquipmentRouter);
router.use('/get-signed-url/ingredient', userGetSignedUrlIngredientRouter);
router.use('/get-signed-url/recipe', userGetSignedUrlRecipeRouter);
router.use('/get-signed-url/recipe-equipment', userGetSignedUrlRecipeEquipmentRouter);
router.use('/get-signed-url/recipe-ingredients', userGetSignedUrlRecipeIngredientsRouter);
router.use('/get-signed-url/recipe-cooking', userGetSignedUrlRecipeCookingRouter);
router.use('/auth', userAuthRouter);
router.use('/equipment', userEquipmentRouter);
router.use('/favorite-recipe', userFavoriteRecipeRouter);
router.use('/friendship', userFriendshipRouter);
router.use('/ingredient', userIngredientRouter);
router.use('/plan', userPlanRouter);
router.use('/profile', userProfileRouter);
router.use('/recipe', userRecipeRouter);
router.use('/saved-recipe', userSavedRecipeRouter);