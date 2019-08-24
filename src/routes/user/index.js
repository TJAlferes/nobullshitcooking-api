const { Router } = require('express');

const userAuthRouter = require('./auth');
const userProfileRouter = require('./profile');
const userGetSignedUrlAvatarRouter = require('./get-signed-url/avatar');
const userGetSignedUrlEquipmentRouter = require('./get-signed-url/equipment');
const userGetSignedUrlIngredientRouter = require('./get-signed-url/ingredient');
const userGetSignedUrlRecipeRouter = require('./get-signed-url/recipe');
const userGetSignedUrlRecipeEquipmentRouter = require('./get-signed-url/recipeEquipment');
const userGetSignedUrlRecipeIngredientsRouter = require('./get-signed-url/recipeIngredients');
const userGetSignedUrlRecipeCookingRouter = require('./get-signed-url/recipeCooking');
const userFriendshipRouter = require('./friendship');
const userFavoriteRecipeRouter = require('./favoriteRecipe');
const userSavedRecipeRouter = require('./savedRecipe');
const userPlanRouter = require('./plan');
const userEquipmentRouter = require('./equipment');
const userIngredientRouter = require('./ingredient');
const userRecipeRouter = require('./recipe');

const router = Router();

router.use('/auth', userAuthRouter);
router.use('/profile', userProfileRouter);
router.use('/get-signed-url/avatar', userGetSignedUrlAvatarRouter);
router.use('/get-signed-url/equipment', userGetSignedUrlEquipmentRouter);
router.use('/get-signed-url/ingredient', userGetSignedUrlIngredientRouter);
router.use('/get-signed-url/recipe', userGetSignedUrlRecipeRouter);
router.use('/get-signed-url/recipe-equipment', userGetSignedUrlRecipeEquipmentRouter);
router.use('/get-signed-url/recipe-ingredients', userGetSignedUrlRecipeIngredientsRouter);
router.use('/get-signed-url/recipe-cooking', userGetSignedUrlRecipeCookingRouter);
router.use('/friendship', userFriendshipRouter)
router.use('/favorite-recipe', userFavoriteRecipeRouter);
router.use('/saved-recipe', userSavedRecipeRouter);
router.use('/plan', userPlanRouter);
router.use('/equipment', userEquipmentRouter);
router.use('/ingredient', userIngredientRouter);
router.use('/recipe', userRecipeRouter);

module.exports = router;