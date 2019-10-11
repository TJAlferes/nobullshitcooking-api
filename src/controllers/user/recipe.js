const pool = require('../../lib/connections/mysqlPoolConnection');
//const esClient = require('../../lib/connections/elasticSearchClient');

const Recipe = require('../../mysql-access/Recipe');
const RecipeMethods = require('../../mysql-access/RecipeMethod');
const RecipeEquipment = require('../../mysql-access/RecipeEquipment');
const RecipeIngredients = require('../../mysql-access/RecipeIngredient');
const RecipeSubrecipes = require('../../mysql-access/RecipeSubrecipe');
//const RecipeSearch = require('../../elasticsearch-access/RecipeSearch');

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
  getInfoToEditMyPrivateUserRecipe: async function(req, res) {
    const recipeId = req.sanitize(req.body.recipeId);
    const authorId = req.session.userInfo.userId;
    const ownerId = req.session.userInfo.userId;
    const recipe = new Recipe(pool);
    const row = await recipe.getInfoToEditMyUserRecipe(recipeId, authorId, ownerId);
    res.send(row);
  },
  getInfoToEditMyPublicUserRecipe: async function(req, res) {
    const recipeId = req.sanitize(req.body.recipeId);
    const authorId = req.session.userInfo.userId;
    const ownerId = 1;
    const recipe = new Recipe(pool);
    const row = await recipe.getInfoToEditMyUserRecipe(recipeId, authorId, ownerId);
    res.send(row);
  },
  createRecipe: async function(req, res, next) {
    try {
      const recipeTypeId = Number(req.sanitize(req.body.recipeInfo.recipeTypeId));
      const cuisineId = Number(req.sanitize(req.body.recipeInfo.cuisineId));
      const title = req.sanitize(req.body.recipeInfo.title);
      const description = req.sanitize(req.body.recipeInfo.description);
      const directions = req.sanitize(req.body.recipeInfo.directions);
      const requiredMethods = req.body.recipeInfo.requiredMethods;
      const requiredEquipment = req.body.recipeInfo.requiredEquipment;
      const requiredIngredients = req.body.recipeInfo.requiredIngredients;
      const requiredSubrecipes = req.body.recipeInfo.requiredSubrecipes;
      const recipeImage = req.sanitize(req.body.recipeInfo.recipeImage);
      const equipmentImage = req.sanitize(req.body.recipeInfo.recipeEquipmentImage);
      const ingredientsImage = req.sanitize(req.body.recipeInfo.recipeIngredientsImage);
      const cookingImage = req.sanitize(req.body.recipeInfo.recipeCookingImage);

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
      const createdRecipe = await recipe.createRecipe(recipeToCreate);

      const generatedId = createdRecipe.insertId;

      if (requiredMethods !== "none" && requiredMethods.length > 0) {
        if (requiredMethods.map(rM => 
          validRecipeMethodsEntity({
            recipeId: generatedId,
            methodId: rM.methodId
          })
        )) {
          let recipeMethodsToCreate = [];
          requiredMethods.map(rM => {
            recipeMethodsToCreate.push(generatedId, rM.methodId)
          });
          const recipeMethodsPlaceholders = '(?, ?),'
          .repeat(requiredMethods.length)
          .slice(0, -1);
          const recipeMethods = new RecipeMethods(pool);
          await recipeMethods.createRecipeMethods(
            recipeMethodsToCreate,
            recipeMethodsPlaceholders
          );
        }
      }

      if (requiredEquipment !== "none" && requiredEquipment.length > 0) {
        if (requiredEquipment.map(rE =>
          validRecipeEquipmentEntity({
            recipeId: generatedId,
            equipmentId: rE.equipment,
            amount: rE.amount
          })
        )) {
          let recipeEquipmentToCreate = [];
          requiredEquipment.map(rE => {
            recipeEquipmentToCreate.push(generatedId, rE.equipment, rE.amount);
          });
          const recipeEquipmentPlaceholders = '(?, ?, ?),'
          .repeat(requiredEquipment.length)
          .slice(0, -1);
          console.log(recipeEquipmentToCreate);
          console.log(recipeEquipmentPlaceholders);
          const recipeEquipment = new RecipeEquipment(pool);
          await recipeEquipment.createRecipeEquipment(
            recipeEquipmentToCreate,
            recipeEquipmentPlaceholders
          );
        }
      }

      if (requiredIngredients !== "none" && requiredIngredients.length > 0) {
        if (requiredIngredients.map(rI =>
          validRecipeIngredientsEntity({
            recipeId: generatedId,
            ingredientId: rI.ingredient,
            amount: rI.amount,
            measurementId: rI.unit
          })
        )) {
          let recipeIngredientsToCreate = [];
          requiredIngredients.map(rI => {
            recipeIngredientsToCreate.push(generatedId, rI.ingredient, rI.amount, rI.unit);
          });
          const recipeIngredientsPlaceholders = '(?, ?, ?, ?),'
          .repeat(requiredIngredients.length)
          .slice(0, -1);
          const recipeIngredients = new RecipeIngredients(pool);
          await recipeIngredients.createRecipeIngredients(
            recipeIngredientsToCreate,
            recipeIngredientsPlaceholders
          );
        }
      }

      if (requiredSubrecipes !== "none" && requiredSubrecipes.length > 0) {
        if (requiredSubrecipes.map(rS =>
          validRecipeSubrecipesEntity({
            recipeId: generatedId,
            subrecipeId: rS.subrecipe,
            amount: rS.amount,
            measurementId: rS.unit
          })
        )) {
          let recipeSubrecipesToCreate = [];
          requiredSubrecipes.map(rS => {
            recipeSubrecipesToCreate.push(generatedId, rS.subrecipe, rS.amount, rS.unit);
          })
          const recipeSubrecipesPlaceholders = '(?, ?, ?, ?),'
          .repeat(requiredSubrecipes.length)
          .slice(0, -1);
          const recipeSubrecipes = new RecipeSubrecipes(pool);
          await recipeSubrecipes.createRecipeSubrecipes(
            recipeSubrecipesToCreate,
            recipeSubrecipesPlaceholders
          );
        }
      }

      /*if (ownership === "public") {
        const recipeInfoFull = await recipe.viewRecipeById(generatedId);
        const recipeInfoCut = {
          // get working in MySQL first, think out searchbar AND searchpage
        };
        const recipeSearch = new RecipeSearch(esClient);
        await recipeSearch.saveRecipe(recipeInfoCut);
      }*/
      
      res.send({message: 'Recipe created.'});
      next();
    } catch(err) {
      next(err);
    }
  },
  updateMyUserRecipe: async function(req, res, next) {
    try {
      const recipeId = req.sanitize(req.body.recipeInfo.recipeId);
      const recipeTypeId = Number(req.sanitize(req.body.recipeInfo.recipeTypeId));
      const cuisineId = Number(req.sanitize(req.body.recipeInfo.cuisineId));
      const title = req.sanitize(req.body.recipeInfo.title);
      const description = req.sanitize(req.body.recipeInfo.description);
      const directions = req.sanitize(req.body.recipeInfo.directions);
      const requiredMethods = req.body.recipeInfo.requiredMethods;
      const requiredEquipment = req.body.recipeInfo.requiredEquipment;
      const requiredIngredients = req.body.recipeInfo.requiredIngredients;
      const requiredSubrecipes = req.body.recipeInfo.requiredSubrecipes;
      const recipeImage = req.sanitize(req.body.recipeInfo.recipeImage);
      const equipmentImage = req.sanitize(req.body.recipeInfo.recipeEquipmentImage);
      const ingredientsImage = req.sanitize(req.body.recipeInfo.recipeIngredientsImage);
      const cookingImage = req.sanitize(req.body.recipeInfo.recipeCookingImage);

      const authorId = req.session.userInfo.userId;
      const ownership = req.sanitize(req.body.recipeInfo.ownership);
      const ownerId = (ownership === "private") ? req.session.userInfo.userId : 1;

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
      await recipe.updateMyUserRecipe(recipeToUpdateWith, recipeId);

      let recipeMethodsToUpdateWith = "none";
      if (requiredMethods !== "none") {
        if (requiredMethods.map(rM => 
          validRecipeMethodsEntity({
            recipeId: generatedId,
            methodId: rM.methodId
          })
        )) {
          recipeMethodsToUpdateWith = [];
          requiredMethods.map(rM => {
            recipeMethodsToUpdateWith.push(generatedId, rM.methodId)
          });
        }
      }
      const recipeMethodsPlaceholders = (requiredMethods !== "none")
      ? '(?, ?),'.repeat(requiredMethods.length).slice(0, -1)
      : "none";
      const recipeMethod = new RecipeMethod(pool);
      await recipeMethod.updateRecipeMethods(
        recipeMethodsToUpdateWith,
        recipeMethodsPlaceholders,
        recipeId
      );

      let recipeEquipmentToUpdateWith = "none";
      if (requiredEquipment !== "none") {
        if (requiredEquipment.map(rE =>
          validRecipeEquipmentEntity({
            recipeId: generatedId,
            equipmentId: rE.equipment,
            amount: rE.amount
          })
        )) {
          recipeEquipmentToUpdateWith = [];
          requiredEquipment.map(rE => {
            recipeEquipmentToUpdateWith.push(generatedId, rE.equipment, rE.amount)
          });
        }
      }
      const recipeEquipmentPlaceholders = (requiredEquipment !== "none")
      ? '(?, ?, ?),'.repeat(requiredEquipment.length).slice(0, -1)
      : "none";
      const recipeEquipment = new RecipeEquipment(pool);
      await recipeEquipment.updateRecipeEquipment(
        recipeEquipmentToUpdateWith,
        recipeEquipmentPlaceholders,
        recipeId
      );

      let recipeIngredientsToUpdateWith = "none";
      if (requiredIngredients !== "none") {
        if (requiredIngredients.map(rI =>
          validRecipeIngredientsEntity({
            recipeId: generatedId,
            ingredientId: rI.ingredient,
            amount: rI.amount,
            measurementId: rI.unit
          })
        )) {
          recipeIngredientsToUpdateWith = [];
          requiredIngredients.map(rI => {
            recipeIngredientsToUpdateWith.push(generatedId, rI.ingredient, rI.amount, rI.unit);
          });
        }
      }
      const recipeIngredientsPlaceholders = (requiredIngredients !== "none")
      ? '(?, ?, ?, ?),'.repeat(requiredIngredients.length).slice(0, -1)
      : "none";
      const recipeIngredient = new RecipeIngredient(pool);
      await recipeIngredient.updateRecipeIngredients(
        recipeIngredientsToUpdateWith,
        recipeIngredientsPlaceholders,
        recipeId
      );

      let recipeSubrecipesToUpdateWith = "none";
      if (requiredSubrecipes !== "none") {
        if (requiredSubrecipes.map(rS =>
          validRecipeSubrecipesEntity({
            recipeId: generatedId,
            subrecipeId: rS.subrecipe,
            amount: rS.amount,
            measurementId: rS.unit
          })
        )) {
          recipeSubrecipesToUpdateWith = [];
          requiredSubrecipes.map(rS => {
            recipeSubrecipesToUpdateWith.push(generatedId, rS.subrecipe, rS.amount, rS.unit);
          });
        }
      }
      const recipeSubrecipesPlaceholders = (requiredSubrecipes !== "none")
      ? '(?, ?, ?, ?),'.repeat(requiredSubrecipes.length).slice(0, -1)
      : "none";
      const recipeSubrecipe = new RecipeSubrecipe(pool);
      await recipeSubrecipe.updateRecipeSubrecipes(
        recipeSubrecipesToUpdateWith,
        recipeSubrecipesPlaceholders,
        recipeId
      );

      res.send({message: 'Recipe updated.'});
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

      //const plan = new Plan(pool);
      const recipeMethods = new RecipeMethods(pool);
      const recipeEquipment = new RecipeEquipment(pool);
      const recipeIngredients = new RecipeIngredients(pool);
      const recipeSubrecipes = new RecipeSubrecipes(pool);
      const recipe = new Recipe(pool);

      await recipeMethods.deleteRecipeMethods(recipeId);
      await recipeEquipment.deleteRecipeEquipment(recipeId);
      await recipeIngredients.deleteRecipeIngredients(recipeId);
      await recipeSubrecipes.deleteRecipeSubrecipes(recipeId);
      await recipeSubrecipes.deleteRecipeSubrecipesBySubrecipeId(recipeId);  // is that right?
      await recipe.deleteMyPrivateUserRecipe(recipeId, authorId, ownerId);

      res.send({message: 'Recipe deleted.'});
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
      await recipe.disownMyPublicUserRecipe(newAuthorId, recipeId, authorId);
      res.send({message: 'Recipe disowned.'});
      next();
    } catch(err) {
      next(err);
    }
  }
};

module.exports = userRecipeController;