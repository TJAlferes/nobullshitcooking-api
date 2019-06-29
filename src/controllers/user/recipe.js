const pool = require('../../data-access/dbPoolConnection');
const User = require('../../data-access/user/User');
const validRecipeEntity = require('../../lib/validations/user/recipeEntity');

// TO DO: Remove all try/catch in controllers if catchExceptions middleware is working?
// TO DO: make only load recipes submitted by this user

const userRecipeController = {
  viewRecipe: async function(req, res, next) {
    try {
      const userId = req.session.userInfo.userId;
      const user = new User(pool);
      const [ rows ] = await user.viewUserRecipe(userId);
      res.send(rows);
      next();
    } catch(err) {
      next(err);
    }
  },
  viewRecipeDetail: async function(req, res, next) {
    const recipeId = req.sanitize(req.params.recipeId);
    const userId = req.session.userInfo.userId;
    const user = new User(pool);
    const [ row ] = await user.viewUserRecipeDetail(recipeId, userId);
    res.send(row);
  },
  createRecipe: async function(req, res, next) {
    try {
      const recipeTypeId = req.sanitize(req.body.recipeInfo.recipeTypeId);
      const cuisineId = req.sanitize(req.body.recipeInfo.cuisineId);
      const title = req.sanitize(req.body.recipeInfo.title);
      const description = req.sanitize(req.body.recipeInfo.description);
      const directions = req.sanitize(req.body.recipeInfo.directions);
      const requiredEquipment = req.sanitize(req.body.recipeInfo.requiredEquipment);
      const requiredIngredients = req.sanitize(req.body.recipeInfo.requiredIngredients);
      const requiredSubrecipes = req.sanitize(req.body.recipeInfo.requiredSubrecipes);
      const recipeImage = req.sanitize(req.body.recipeInfo.recipeImage);
      const equipmentImage = req.sanitize(req.body.recipeInfo.equipmentImage);
      const ingredientsImage = req.sanitize(req.body.recipeInfo.ingredientsImage);
      const cookingImage = req.sanitize(req.body.recipeInfo.cookingImage);

      const userId = req.session.userInfo.userId;

      const user = new User(pool);

      const recipeToCreate = validRecipeEntity({
        recipeTypeId,
        cuisineId,
        title,
        description,
        directions,
        requiredEquipment,
        requiredIngredients,
        requiredSubrecipes,
        recipeImage,
        equipmentImage,
        ingredientsImage,
        cookingImage
      });
      const [ row ] = await user.createUserRecipe(recipeToCreate, userId);

      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  },
  updateRecipe: async function(req, res, next) {
    try {
      const recipeTypeId = req.sanitize(req.body.recipeInfo.recipeTypeId);
      const cuisineId = req.sanitize(req.body.recipeInfo.cuisineId);
      const title = req.sanitize(req.body.recipeInfo.title);
      const description = req.sanitize(req.body.recipeInfo.description);
      const directions = req.sanitize(req.body.recipeInfo.directions);
      const requiredEquipment = req.sanitize(req.body.recipeInfo.requiredEquipment);
      const requiredIngredients = req.sanitize(req.body.recipeInfo.requiredIngredients);
      const requiredSubrecipes = req.sanitize(req.body.recipeInfo.requiredSubrecipes);
      const recipeImage = req.sanitize(req.body.recipeInfo.recipeImage);
      const equipmentImage = req.sanitize(req.body.recipeInfo.equipmentImage);
      const ingredientsImage = req.sanitize(req.body.recipeInfo.ingredientsImage);
      const cookingImage = req.sanitize(req.body.recipeInfo.cookingImage);

      const userId = req.session.userInfo.userId;

      const user = new User(pool);

      const recipeToUpdate = validRecipeEntity({
        recipeTypeId,
        cuisineId,
        title,
        description,
        directions,
        requiredEquipment,
        requiredIngredients,
        requiredSubrecipes,
        recipeImage,
        equipmentImage,
        ingredientsImage,
        cookingImage
      });
      const [ row ] = await user.updateUserRecipe(recipeToUpdate, userId);

      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  },
  deleteRecipe: async function(req, res, next) {
    try {
      const recipeId = req.sanitize(req.body.recipeId);  // sanitize and validate?
      const userId = req.session.userInfo.userId;
      const user = new User(pool);
      const [ row ] = await user.deleteUserRecipe(recipeId, userId);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  }
};

module.exports = userRecipeController;