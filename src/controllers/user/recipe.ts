import { Request, Response } from 'express';

const pool = require('../../lib/connections/mysqlPoolConnection');
const esClient = require('../../lib/connections/elasticsearchClient');

const Recipe = require('../../mysql-access/Recipe');
const RecipeMethod = require('../../mysql-access/RecipeMethod');
const RecipeEquipment = require('../../mysql-access/RecipeEquipment');
const RecipeIngredient = require('../../mysql-access/RecipeIngredient');
const RecipeSubrecipe = require('../../mysql-access/RecipeSubrecipe');

const RecipeSearch = require('../../elasticsearch-access/RecipeSearch');

const createRecipeService = require('../../lib/services/create-recipe');
const updateRecipeService = require('../../lib/services/update-recipe');

const validRecipeEntity = require('../../lib/validations/recipe/recipeEntity');
const validRecipeMethodsEntity = require('../../lib/validations/recipeMethod/recipeMethodEntity');
const validRecipeEquipmentEntity = require('../../lib/validations/recipeEquipment/recipeEquipmentEntity');
const validRecipeIngredientsEntity = require('../../lib/validations/recipeIngredient/recipeIngredientEntity');
const validRecipeSubrecipesEntity = require('../../lib/validations/recipeSubrecipe/recipeSubrecipeEntity');

const userRecipeController = {
  viewAllMyPrivateUserRecipes: async function(req: Request, res: Response) {
    const authorId = req.session.userInfo.userId;
    const ownerId = req.session.userInfo.userId;
    const recipe = new Recipe(pool);
    const rows = await recipe.viewRecipes(authorId, ownerId);
    res.send(rows);
  },
  
  viewAllMyPublicUserRecipes: async function(req: Request, res: Response) {
    const authorId = req.session.userInfo.userId;
    const ownerId = 1;
    const recipe = new Recipe(pool);
    const rows = await recipe.viewRecipes(authorId, ownerId);
    res.send(rows);
  },

  viewMyPrivateUserRecipe: async function(req: Request, res: Response) {
    const recipeId = Number(req.body.recipeId);
    const authorId = 1;
    const ownerId = req.session.userInfo.userId;
    const recipe = new Recipe(pool);
    const [ row ] = await recipe.viewRecipeById(recipeId, authorId, ownerId);
    res.send(row);
  },

  viewMyPublicUserRecipe: async function(req: Request, res: Response) {
    const recipeId = Number(req.body.recipeId);
    const authorId = req.session.userInfo.userId;
    const ownerId = 1;
    const recipe = new Recipe(pool);
    const [ row ] = await recipe.viewRecipeById(recipeId, authorId, ownerId);
    res.send(row);
  },

  getInfoToEditMyPrivateUserRecipe: async function(req: Request, res: Response) {
    const recipeId = Number(req.body.recipeId);
    const authorId = req.session.userInfo.userId;
    const ownerId = req.session.userInfo.userId;
    const recipe = new Recipe(pool);
    const row = await recipe.getInfoToEditMyUserRecipe(recipeId, authorId, ownerId);
    res.send(row);
  },

  getInfoToEditMyPublicUserRecipe: async function(req: Request, res: Response) {
    const recipeId = Number(req.body.recipeId);
    const authorId = req.session.userInfo.userId;
    const ownerId = 1;
    const recipe = new Recipe(pool);
    const row = await recipe.getInfoToEditMyUserRecipe(recipeId, authorId, ownerId);
    res.send(row);
  },

  createRecipe: async function(req: Request, res: Response) {
    const recipeTypeId = Number(req.body.recipeInfo.recipeTypeId);
    const cuisineId = Number(req.body.recipeInfo.cuisineId);
    const title = req.body.recipeInfo.title;
    const description = req.body.recipeInfo.description;
    const directions = req.body.recipeInfo.directions;
    const requiredMethods = req.body.recipeInfo.requiredMethods;
    const requiredEquipment = req.body.recipeInfo.requiredEquipment;
    const requiredIngredients = req.body.recipeInfo.requiredIngredients;
    const requiredSubrecipes = req.body.recipeInfo.requiredSubrecipes;
    const recipeImage = req.body.recipeInfo.recipeImage;
    const equipmentImage = req.body.recipeInfo.recipeEquipmentImage;
    const ingredientsImage = req.body.recipeInfo.recipeIngredientsImage;
    const cookingImage = req.body.recipeInfo.recipeCookingImage;

    const authorId = req.session.userInfo.userId;
    const ownership = req.body.recipeInfo.ownership;
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

    if (requiredMethods !== "none" && requiredMethods.length > 0) {
      requiredMethods.map(rM => validRecipeMethodsEntity({
        recipeId: generatedId,
        methodId: rM.methodId
      }));
    }

    if (requiredEquipment !== "none" && requiredEquipment.length > 0) {
      requiredEquipment.map(rE => validRecipeEquipmentEntity({
        recipeId: generatedId,
        equipmentId: rE.equipment,
        amount: rE.amount
      }));
    }

    if (requiredIngredients !== "none" && requiredIngredients.length > 0) {
      requiredIngredients.map(rI => validRecipeIngredientsEntity({
        recipeId: generatedId,
        ingredientId: rI.ingredient,
        amount: rI.amount,
        measurementId: rI.unit
      }));
    }

    if (requiredSubrecipes !== "none" && requiredSubrecipes.length > 0) {
      requiredSubrecipes.map(rS => validRecipeSubrecipesEntity({
        recipeId: generatedId,
        subrecipeId: rS.subrecipe,
        amount: rS.amount,
        measurementId: rS.unit
      }));
    }

    const recipe = new Recipe(pool);
    const recipeMethod = new RecipeMethod(pool);
    const recipeEquipment = new RecipeEquipment(pool);
    const recipeIngredient = new RecipeIngredient(pool);
    const recipeSubrecipe = new RecipeSubrecipe(pool);
    const recipeSearch = new RecipeSearch(esClient);

    await createRecipeService({
      recipe,
      recipeMethod,
      recipeEquipment,
      recipeIngredient,
      recipeSubrecipe,
      recipeSearch,
      ownerId,
      recipeToCreate,
      requiredMethods,
      requiredEquipment,
      requiredIngredients,
      requiredSubrecipes
    });
    
    res.send({message: 'Recipe created.'});
  },

  updateMyUserRecipe: async function(req: Request, res: Response) {
    const recipeId = Number(req.body.recipeInfo.recipeId);
    const recipeTypeId = Number(req.body.recipeInfo.recipeTypeId);
    const cuisineId = Number(req.body.recipeInfo.cuisineId);
    const title = req.body.recipeInfo.title;
    const description = req.body.recipeInfo.description;
    const directions = req.body.recipeInfo.directions;
    const requiredMethods = req.body.recipeInfo.requiredMethods;
    const requiredEquipment = req.body.recipeInfo.requiredEquipment;
    const requiredIngredients = req.body.recipeInfo.requiredIngredients;
    const requiredSubrecipes = req.body.recipeInfo.requiredSubrecipes;
    const recipeImage = req.body.recipeInfo.recipeImage;
    const equipmentImage = req.body.recipeInfo.recipeEquipmentImage;
    const ingredientsImage = req.body.recipeInfo.recipeIngredientsImage;
    const cookingImage = req.body.recipeInfo.recipeCookingImage;

    const authorId = req.session.userInfo.userId;
    const ownership = req.body.recipeInfo.ownership;
    const ownerId = (ownership === "private") ? req.session.userInfo.userId : 1;

    if (recipeId == "" || typeof recipeId === "undefined") {
      return res.send({message: 'Invalid recipe ID!'});
    }

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

    if (requiredMethods !== "none") {
      requiredMethods.map(rM => validRecipeMethodsEntity({
        recipeId,
        methodId: rM.methodId
      }));
    }

    if (requiredEquipment !== "none") {
      requiredEquipment.map(rE => validRecipeEquipmentEntity({
        recipeId,
        equipmentId: rE.equipment,
        amount: rE.amount
      }));
    }

    if (requiredIngredients !== "none") {
      requiredIngredients.map(rI => validRecipeIngredientsEntity({
        recipeId,
        ingredientId: rI.ingredient,
        amount: rI.amount,
        measurementId: rI.unit
      }));
    }

    if (requiredSubrecipes !== "none") {
      requiredSubrecipes.map(rS => validRecipeSubrecipesEntity({
        recipeId,
        subrecipeId: rS.subrecipe,
        amount: rS.amount,
        measurementId: rS.unit
      }));
    }

    const recipe = new Recipe(pool);
    const recipeMethod = new RecipeMethod(pool);
    const recipeEquipment = new RecipeEquipment(pool);
    const recipeIngredient = new RecipeIngredient(pool);
    const recipeSubrecipe = new RecipeSubrecipe(pool);
    const recipeSearch = new RecipeSearch(esClient);

    await updateRecipeService({
      recipe,
      recipeMethod,
      recipeEquipment,
      recipeIngredient,
      recipeSubrecipe,
      recipeSearch,
      ownerId,
      recipeToUpdateWith,
      requiredMethods,
      requiredEquipment,
      requiredIngredients,
      requiredSubrecipes
    });

    res.send({message: 'Recipe updated.'});
  },

  deleteMyPrivateUserRecipe: async function(req: Request, res: Response) {
    const recipeId = Number(req.body.recipeId);
    const authorId = req.session.userInfo.userId;
    const ownerId = req.session.userInfo.userId;

    const recipeMethod = new RecipeMethod(pool);
    const recipeEquipment = new RecipeEquipment(pool);
    const recipeIngredient = new RecipeIngredient(pool);
    const recipeSubrecipe = new RecipeSubrecipe(pool);
    const recipe = new Recipe(pool);

    await recipeMethod.deleteRecipeMethods(recipeId);
    await recipeEquipment.deleteRecipeEquipment(recipeId);
    await recipeIngredient.deleteRecipeIngredients(recipeId);
    await recipeSubrecipe.deleteRecipeSubrecipes(recipeId);
    await recipeSubrecipe.deleteRecipeSubrecipesBySubrecipeId(recipeId);
    await recipe.deleteMyPrivateUserRecipe(recipeId, authorId, ownerId);

    res.send({message: 'Recipe deleted.'});
  },

  disownMyPublicUserRecipe: async function(req: Request, res: Response) {
    const recipeId = Number(req.body.recipeId);
    const authorId = req.session.userInfo.userId;

    const newAuthorId = 2;

    const recipe = new Recipe(pool);

    await recipe.disownMyPublicUserRecipe(newAuthorId, recipeId, authorId);

    // (make sure the update goes through first though)
    const recipeInfoForElasticSearch = await recipe
    .getPublicRecipeForElasticSearchInsert(generatedId);

    const recipeSearch = new RecipeSearch(esClient);

    await recipeSearch.saveRecipe(recipeInfoForElasticSearch);

    res.send({message: 'Recipe disowned.'});
  }
};

module.exports = userRecipeController;