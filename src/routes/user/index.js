const { Router } = require('express');

const userAuthRouter = require('./auth');
const userFriendshipRouter = require('./friendship');
const userFavoriteRecipeRouter = require('./favoriteRecipe');
const userSavedRecipeRouter = require('./savedRecipe');
const userPlanRouter = require('./plan');
const userEquipmentRouter = require('./equipment');
const userIngredientRouter = require('./ingredient');
const userRecipeRouter = require('./recipe');

const router = Router();

router.use('/auth', userAuthRouter);
router.use('/friendship', userFriendshipRouter)
router.use('/favorite-recipe', userFavoriteRecipeRouter);
router.use('/saved-recipe', userSavedRecipeRouter);
router.use('/plan', userPlanRouter);
router.use('/equipment', userEquipmentRouter);
router.use('/ingredient', userIngredientRouter);
router.use('/recipe', userRecipeRouter);

module.exports = router;