const pool = require('../../data-access/dbPoolConnection');
const Recipe = require('../../data-access/Recipe');
const RecipeMethods = require('../../data-access/RecipeMethods');
const RecipeEquipment = require('../../data-access/RecipeEquipment');
const RecipeIngredients = require('../../data-access/RecipeIngredients');
const RecipeSubrecipes = require('../../data-access/RecipeSubrecipes');
const validRecipeEntity = require('../../lib/validations/recipeEntity');
const validRecipeMethodsEntity = require('../../lib/validations/recipeMethodsEntity');
const validRecipeEquipmentEntity = require('../../lib/validations/recipeEquipmentEntity');
const validRecipeIngredientsEntity = require('../../lib/validations/recipeIngredientsEntity');
const validRecipeSubrecipesEntity = require('../../lib/validations/recipeSubrecipesEntity');

const userRecipeController = {
  viewAllMyPrivateUserRecipes: async function(req, res, next) {
    try {
      const ownerId = req.session.userInfo.userId;
      const recipe = new Recipe(pool);
      const rows = await recipe.viewAllMyPrivateUserRecipes(ownerId);
      res.send(rows);
      next();
    } catch(err) {
      next(err);
    }
  },
  viewAllMyPublicUserRecipes: async function(req, res, next) {
    try {
      const authorId = req.session.userInfo.userId;
      const ownerId = 1;
      const recipe = new Recipe(pool);
      const rows = await recipe.viewAllMyPublicUserRecipes(authorId, ownerId);
      res.send(rows);
      next();
    } catch(err) {
      next(err);
    }
  },
  viewMyPrivateUserRecipe: async function(req, res, next) {
    try {
      const recipeId = req.sanitize(req.body.recipeId);
      const ownerId = req.session.userInfo.userId;
      const recipe = new Recipe(pool);
      const [ row ] = await recipe.viewMyPrivateUserRecipe(recipeId, ownerId);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  },
  viewMyPublicUserRecipe: async function(req, res, next) {
    try {
      const recipeId = req.sanitize(req.body.recipeId);
      const authorId = req.session.userInfo.userId;
      const ownerId = 1;
      const recipe = new Recipe(pool);
      const [ row ] = await recipe.viewMyPublicUserRecipe(recipeId, authorId, ownerId);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  },
  createRecipe: async function(req, res, next) {
    try {
      const recipeTypeId = req.sanitize(req.body.recipeInfo.recipeTypeId);
      const cuisineId = req.sanitize(req.body.recipeInfo.cuisineId);
      const title = req.sanitize(req.body.recipeInfo.title);
      const description = req.sanitize(req.body.recipeInfo.description);
      const directions = req.sanitize(req.body.recipeInfo.directions);
      const requiredMethods = req.sanitize(req.body.recipeInfo.requiredMethods);
      const requiredEquipment = req.sanitize(req.body.recipeInfo.requiredEquipment);
      const requiredIngredients = req.sanitize(req.body.recipeInfo.requiredIngredients);
      const requiredSubrecipes = req.sanitize(req.body.recipeInfo.requiredSubrecipes);
      const recipeImage = req.sanitize(req.body.recipeInfo.recipeImage);
      const equipmentImage = req.sanitize(req.body.recipeInfo.equipmentImage);
      const ingredientsImage = req.sanitize(req.body.recipeInfo.ingredientsImage);
      const cookingImage = req.sanitize(req.body.recipeInfo.cookingImage);

      const authorId = req.session.userInfo.userId;
      const ownership = req.sanitize(req.body.recipeInfo.ownership);
      const ownerId = (ownership === "private") ? req.session.userInfo.userId : 1;

      const recipeToCreate = validRecipeEntity({
        recipeTypeId,
        cuisineId,
        authorId,
        ownerId,
        title,
        description,
        directions,
        recipeImage,
        equipmentImage,
        ingredientsImage,
        cookingImage
      });
      const recipe = new Recipe(pool);
      const [ createdRecipe ] = await recipe.createRecipe(recipeToCreate);

      const generatedId = createdRecipe.insertId;

      let resObj = {createRecipe};

      const recipeMethodsToCreate = requiredMethods.map(rM =>
        validRecipeMethodsEntity({
          recipeId: generatedId,
          methodId: rM.methodId
        })
      );
      const recipeMethodsPlaceholders = '(?, ?),'
      .repeat(requiredMethods.length)
      .slice(0, -1);
      const recipeMethods = new RecipeMethods(pool);
      const [ createdRecipeMethods ] = await recipeMethods
      .createRecipeMethods(
        recipeMethodsToCreate,
        recipeMethodsPlaceholders,
        generatedId
      );
      resObj.createdRecipeMethods = createdRecipeMethods;

      if (requiredEquipment.length > 0) {
        const recipeEquipmentToCreate = requiredEquipment.map(rE =>
          validRecipeEquipmentEntity({
            recipeId: generatedId,
            equipmentId: rE.equipmentId,
            amount: rE.amount
          })
        );
        const recipeEquipmentPlaceholders = '(?, ?, ?),'
        .repeat(requiredEquipment.length)
        .slice(0, -1);
        const recipeEquipment = new RecipeEquipment(pool);
        const [ createdRecipeEquipment ] = await recipeEquipment
        .createRecipeEquipment(
          recipeEquipmentToCreate,
          recipeEquipmentPlaceholders,
          generatedId
        );
        resObj.createdRecipeEquipment = createdRecipeEquipment;
      }

      if (requiredIngredients.length > 0) {
        const recipeIngredientsToCreate = requiredIngredients.map(rI =>
          validRecipeIngredientsEntity({
            recipeId: generatedId,
            ingredientId: rI.ingredientId,
            amount: rI.amount,
            measurementId: rI.measurementId
          })
        );
        const recipeIngredientsPlaceholders = '(?, ?, ?, ?),'
        .repeat(requiredIngredients.length)
        .slice(0, -1);
        const recipeIngredients = new RecipeIngredients(pool);
        const [ createdRecipeIngredients ] = await recipeIngredients
        .createRecipeIngredients(
          recipeIngredientsToCreate,
          recipeIngredientsPlaceholders,
          generatedId
        );
        resObj.createdRecipeIngredients = createdRecipeIngredients;
      }

      if (requiredSubrecipes.length > 0) {
        const recipeSubrecipesToCreate = requiredSubrecipes.map(rS =>
          validRecipeSubrecipesEntity({
            recipeId: generatedId,
            subrecipeId: rS.subrecipeId,
            amount: rS.amount,
            measurementId: rS.measurementId
          })
        );
        const recipeSubrecipesPlaceholders = '(?, ?, ?, ?),'
        .repeat(requiredSubrecipes.length)
        .slice(0, -1);
        const recipeSubrecipes = new RecipeSubrecipes(pool);
        const [ createdRecipeSubrecipes ] = await recipeSubrecipes
        .createRecipeSubrecipes(
          recipeSubrecipesToCreate,
          recipeSubrecipesPlaceholders,
          generatedId
        );
        resObj.createdRecipeSubrecipes = createdRecipeSubrecipes;
      }

      res.send(resObj);
      next();
    } catch(err) {
      next(err);
    }
  },
  updateUserRecipe: async function(req, res, next) {
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

      const recipeId = req.sanitize(req.body.recipeInfo.recipeId);

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
      const [ row ] = await user.updateUserRecipe(recipeToUpdate, recipeId, userId);

      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  },
  deleteMyPrivateUserRecipe: async function(req, res, next) {  // for any parent PrivateUserRecipes / PrivateUserPlans, set NotFound placeholder
    try {
      const recipeId = req.sanitize(req.body.recipeId);
      const authorId = req.session.userInfo.userId;
      const ownerId = req.session.userInfo.userId;
      const recipeMethods = new RecipeMethods(pool);
      const recipeEquipment = new RecipeEquipment(pool);
      const recipeIngredients = new RecipeIngredients(pool);
      const recipeSubrecipes = new RecipeSubrecipes(pool);
      const recipe = new Recipe(pool);
      await recipeMethods.deleteRecipeMethods(recipeId);
      await recipeEquipment.deleteRecipeEquipment(recipeId);
      await recipeIngredients.deleteRecipeIngredients(recipeId);
      await recipeSubrecipes.deleteRecipeSubrecipes(recipeId);
      const [ row ] = await recipe.deleteMyPrivateUserRecipe(recipeId, authorId, ownerId);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  },
  disownMyPublicUserRecipe: async function(req, res, next) {
    try {
      const newAuthorId = 2;
      const recipeId = req.sanitize(req.body.recipeId);
      const authorId = req.session.userInfo.userId;
      const recipe = new Recipe(pool);
      const [ row ] = await recipe.disownMyPublicUserRecipe(newAuthorId, recipeId, authorId);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  }
};

module.exports = userRecipeController;