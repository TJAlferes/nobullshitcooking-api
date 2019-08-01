const pool = require('../../lib/connections/mysqlPoolConnection');

const Recipe = require('../../mysql-access/Recipe');
const RecipeMethods = require('../../mysql-access/RecipeMethod');
const RecipeEquipment = require('../../mysql-access/RecipeEquipment');
const RecipeIngredients = require('../../mysql-access/RecipeIngredient');
const RecipeSubrecipes = require('../../mysql-access/RecipeSubrecipe');

const validRecipeEntity = require('../../lib/validations/recipe/recipeEntity');
const validRecipeMethodsEntity = require('../../lib/validations/recipeMethod/recipeMethodEntity');
const validRecipeEquipmentEntity = require('../../lib/validations/recipeEquipment/recipeEquipmentEntity');
const validRecipeIngredientsEntity = require('../../lib/validations/recipeIngredient/recipeIngredientEntity');
const validRecipeSubrecipesEntity = require('../../lib/validations/recipeSubrecipe/recipeSubrecipeEntity');

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
  updateMyPrivateUserRecipe: async function(req, res, next) {
    try {
      const recipeId = req.sanitize(req.body.recipeInfo.recipeId);
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
      const ownerId = req.session.userInfo.userId;

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
      await recipe.updateMyPrivateUserRecipe(recipeToUpdateWith, recipeId);

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
          equipmentId: rE.equipmentId,
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
          ingredientId: rI.ingredientId,
          amount: rI.amount,
          measurementId: rI.measurementId
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
          subrecipeId: rS.subrecipeId,
          amount: rS.amount,
          measurementId: rS.measurementId
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
  updateMyPublicUserRecipe: async function(req, res, next) {
    try {
      const recipeId = req.sanitize(req.body.recipeInfo.recipeId);
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
      await recipe.updateMyPublicUserRecipe(recipeToUpdateWith, recipeId);

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
          equipmentId: rE.equipmentId,
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
          ingredientId: rI.ingredientId,
          amount: rI.amount,
          measurementId: rI.measurementId
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
          subrecipeId: rS.subrecipeId,
          amount: rS.amount,
          measurementId: rS.measurementId
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
  deleteMyPrivateUserRecipe: async function(req, res, next) {
    try {
      const recipeId = req.sanitize(req.body.recipeId);
      const authorId = req.session.userInfo.userId;
      const ownerId = req.session.userInfo.userId;

      const plan = new plan(pool);
      const recipeMethods = new RecipeMethods(pool);
      const recipeEquipment = new RecipeEquipment(pool);
      const recipeIngredients = new RecipeIngredients(pool);
      const recipeSubrecipes = new RecipeSubrecipes(pool);
      const recipe = new Recipe(pool);

      await recipeMethods.deleteRecipeMethods(recipeId);
      await recipeEquipment.deleteRecipeEquipment(recipeId);
      await recipeIngredients.deleteRecipeIngredients(recipeId);
      await recipeSubrecipes.deleteRecipeSubrecipes(recipeId);
      await recipe.deleteMyPrivateUserRecipe(recipeId, authorId, ownerId);

      res.send('Recipe deleted.');
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