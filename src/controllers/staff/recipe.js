const pool = require('../../lib/connections/mysqlPoolConnection');

const Recipe = require('../../mysql-access/Recipe');
const RecipeMethod = require('../../mysql-access/RecipeMethod');
const RecipeEquipment = require('../../mysql-access/RecipeEquipment');
const RecipeIngredient = require('../../mysql-access/RecipeIngredient');
const RecipeSubrecipe = require('../../mysql-access/RecipeSubrecipe');
const FavoriteRecipe = require('../../mysql-access/FavoriteRecipe');
const SavedRecipe = require('../../mysql-access/SavedRecipe');

const validRecipeEntity = require('../../lib/validations/recipe/recipeEntity');
const validRecipeMethodsEntity = require('../../lib/validations/recipeMethod/recipeMethodEntity');
const validRecipeEquipmentEntity = require('../../lib/validations/recipeEquipment/recipeEquipmentEntity');
const validRecipeIngredientsEntity = require('../../lib/validations/recipeIngredient/recipeIngredientEntity');
const validRecipeSubrecipesEntity = require('../../lib/validations/recipeSubrecipe/recipeSubrecipeEntity');

const staffRecipeController = {
  createRecipe: async function(req, res, next) {
    try {
      const recipeTypeId = Number(req.sanitize(req.body.recipeInfo.recipeTypeId));
      const cuisineId = Number(req.sanitize(req.body.recipeInfo.cuisineId));
      const title = req.sanitize(req.body.recipeInfo.title);
      const description = req.sanitize(req.body.recipeInfo.description);
      const directions = req.sanitize(req.body.recipeInfo.directions);
      const requiredMethods = req.sanitize(req.body.recipeInfo.requiredMethods);
      const requiredEquipment = req.sanitize(req.body.recipeInfo.requiredEquipment);
      const requiredIngredients = req.sanitize(req.body.recipeInfo.requiredIngredients);
      const requiredSubrecipes = req.sanitize(req.body.recipeInfo.requiredSubrecipes);
      const recipeImage = req.sanitize(req.body.recipeInfo.recipeImage);
      const equipmentImage = req.sanitize(req.body.recipeInfo.recipeEquipmentImage);
      const ingredientsImage = req.sanitize(req.body.recipeInfo.recipeIngredientsImage);
      const cookingImage = req.sanitize(req.body.recipeInfo.recipeCookingImage);

      const authorId = 1;
      const ownerId = 1;

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
      const recipeMethod = new RecipeMethod(pool);
      const [ createdRecipeMethods ] = await recipeMethod
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
            equipmentId: rE.equipment,
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
            ingredientId: rI.ingredient,
            amount: rI.amount,
            measurementId: rI.unit
          })
        );
        const recipeIngredientsPlaceholders = '(?, ?, ?, ?),'
        .repeat(requiredIngredients.length)
        .slice(0, -1);
        const recipeIngredient = new RecipeIngredient(pool);
        const [ createdRecipeIngredients ] = await recipeIngredient
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
            subrecipeId: rS.subrecipe,
            amount: rS.amount,
            measurementId: rS.unit
          })
        );
        const recipeSubrecipesPlaceholders = '(?, ?, ?, ?),'
        .repeat(requiredSubrecipes.length)
        .slice(0, -1);
        const recipeSubrecipe = new RecipeSubrecipe(pool);
        const [ createdRecipeSubrecipes ] = await recipeSubrecipe
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
  updateRecipe: async function(req, res, next) {
    try {
      const recipeId = req.sanitize(req.body.recipeInfo.recipeId);
      const recipeTypeId = Number(req.sanitize(req.body.recipeInfo.recipeTypeId));
      const cuisineId = Number(req.sanitize(req.body.recipeInfo.cuisineId));
      const title = req.sanitize(req.body.recipeInfo.title);
      const description = req.sanitize(req.body.recipeInfo.description);
      const directions = req.sanitize(req.body.recipeInfo.directions);
      const requiredMethods = req.sanitize(req.body.recipeInfo.requiredMethods);
      const requiredEquipment = req.sanitize(req.body.recipeInfo.requiredEquipment);
      const requiredIngredients = req.sanitize(req.body.recipeInfo.requiredIngredients);
      const requiredSubrecipes = req.sanitize(req.body.recipeInfo.requiredSubrecipes);
      const recipeImage = req.sanitize(req.body.recipeInfo.recipeImage);
      const equipmentImage = req.sanitize(req.body.recipeInfo.recipeEquipmentImage);
      const ingredientsImage = req.sanitize(req.body.recipeInfo.recipeIngredientsImage);
      const cookingImage = req.sanitize(req.body.recipeInfo.recipeCookingImage);

      const authorId = 1;
      const ownerId = 1;

      const recipeToUpdateWith = validRecipeEntity({
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
      await recipe.updateRecipe(recipeToUpdateWith, recipeId);

      const recipeMethodsToUpdateWith = requiredMethods.map(rM =>
        validRecipeMethodsEntity({
          recipeId: generatedId,
          methodId: rM.methodId
        })
      );
      const recipeMethodsPlaceholders = '(?, ?),'
      .repeat(requiredMethods.length)
      .slice(0, -1);
      const recipeMethod = new RecipeMethod(pool);
      await recipeMethod.updateRecipeMethods(recipeMethodsToUpdateWith, recipeMethodsPlaceholders, recipeId);

      const recipeEquipmentToUpdateWith = requiredEquipment.map(rE =>
        validRecipeEquipmentEntity({
          recipeId: generatedId,
          equipmentId: rE.equipment,
          amount: rE.amount
        })
      );
      const recipeEquipmentPlaceholders = '(?, ?, ?),'
      .repeat(requiredEquipment.length)
      .slice(0, -1);
      const recipeEquipment = new RecipeEquipment(pool);
      await recipeEquipment.updateRecipeEquipment(
        recipeEquipmentToUpdateWith,
        recipeEquipmentPlaceholders,
        recipeId
      );

      const recipeIngredientsToUpdateWith = requiredIngredients.map(rI =>
        validRecipeIngredientsEntity({
          recipeId: generatedId,
          ingredientId: rI.ingredient,
          amount: rI.amount,
          measurementId: rI.unit
        })
      );
      const recipeIngredientsPlaceholders = '(?, ?, ?, ?),'
      .repeat(requiredIngredients.length)
      .slice(0, -1);
      const recipeIngredient = new RecipeIngredient(pool);
      await recipeIngredient.updateRecipeIngredients(
        recipeIngredientsToUpdateWith,
        recipeIngredientsPlaceholders,
        recipeId
      );

      const recipeSubrecipesToUpdateWith = requiredSubrecipes.map(rS =>
        validRecipeSubrecipesEntity({
          recipeId: generatedId,
          subrecipeId: rS.subrecipe,
          amount: rS.amount,
          measurementId: rS.unit
        })
      );
      const recipeSubrecipesPlaceholders = '(?, ?, ?, ?),'
      .repeat(requiredSubrecipes.length)
      .slice(0, -1);
      const recipeSubrecipe = new RecipeSubrecipe(pool);
      await recipeSubrecipe.updateRecipeSubrecipes(
        recipeSubrecipesToUpdateWith,
        recipeSubrecipesPlaceholders,
        recipeId
      );

      res.send('Recipe updated.');
      next();
    } catch(err) {
      next(err);
    }
  },
  deleteRecipe: async function(req, res, next) {
    try {
      const recipeId = req.sanitize(req.body.recipeId);

      // transaction(s)?:
      const favoriteRecipe = new FavoriteRecipe(pool);
      const savedRecipe = new SavedRecipe(pool);
      const recipeMethod = new RecipeMethod(pool);
      const recipeEquipment = new RecipeEquipment(pool);
      const recipeIngredient = new RecipeIngredient(pool);
      const recipeSubrecipe = new RecipeSubrecipe(pool);
      const recipe = new Recipe(pool);

      await favoriteRecipe.deleteAllFavoritesOfRecipe(recipeId);
      await savedRecipe.deleteAllSavesOfRecipe(recipeId);
      await recipeMethod.deleteRecipeMethods(recipeId);
      await recipeEquipment.deleteRecipeEquipment(recipeId);
      await recipeIngredient.deleteRecipeIngredients(recipeId);
      await recipeSubrecipe.deleteRecipeSubrecipes(recipeId);
      await recipe.deleteRecipe(recipeId);

      res.send('Recipe deleted.');
      next();
    } catch(err) {
      next(err);
    }
  }
};

module.exports = staffRecipeController;