const pool = require('../../lib/connections/mysqlPoolConnection');
const esClient = require('../../lib/connections/elasticsearchClient');

const Recipe = require('../../mysql-access/Recipe');
const RecipeMethod = require('../../mysql-access/RecipeMethod');
const RecipeEquipment = require('../../mysql-access/RecipeEquipment');
const RecipeIngredient = require('../../mysql-access/RecipeIngredient');
const RecipeSubrecipe = require('../../mysql-access/RecipeSubrecipe');
const FavoriteRecipe = require('../../mysql-access/FavoriteRecipe');
const SavedRecipe = require('../../mysql-access/SavedRecipe');

const RecipeSearch = require('../../elasticsearch-access/RecipeSearch');

const createRecipeService = require('../../lib/services/create-recipe');
const updateRecipeService = require('../../lib/services/update-recipe');

const validRecipeEntity = require('../../lib/validations/recipe/recipeEntity');
const validRecipeMethodsEntity = require('../../lib/validations/recipeMethod/recipeMethodEntity');
const validRecipeEquipmentEntity = require('../../lib/validations/recipeEquipment/recipeEquipmentEntity');
const validRecipeIngredientsEntity = require('../../lib/validations/recipeIngredient/recipeIngredientEntity');
const validRecipeSubrecipesEntity = require('../../lib/validations/recipeSubrecipe/recipeSubrecipeEntity');

const staffRecipeController = {
  createRecipe: async function(req, res) {
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

    if (requiredSubrecipes !== "none" & requiredSubrecipes.length > 0) {
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
  updateRecipe: async function(req, res) {
    const recipeId = Number(req.sanitize(req.body.recipeInfo.recipeId));
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

    const authorId = 1;
    const ownerId = 1;

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

    res.send('Recipe updated.');
  },
  deleteRecipe: async function(req, res) {
    const recipeId = Number(req.sanitize(req.body.recipeId));

    // transaction(s)?:
    const favoriteRecipe = new FavoriteRecipe(pool);
    const savedRecipe = new SavedRecipe(pool);
    const recipeMethod = new RecipeMethod(pool);
    const recipeEquipment = new RecipeEquipment(pool);
    const recipeIngredient = new RecipeIngredient(pool);
    const recipeSubrecipe = new RecipeSubrecipe(pool);
    const recipe = new Recipe(pool);

    const recipeSearch = new RecipeSearch(esClient);

    await favoriteRecipe.deleteAllFavoritesOfRecipe(recipeId);
    await savedRecipe.deleteAllSavesOfRecipe(recipeId);
    await recipeMethod.deleteRecipeMethods(recipeId);
    await recipeEquipment.deleteRecipeEquipment(recipeId);
    await recipeIngredient.deleteRecipeIngredients(recipeId);
    await recipeSubrecipe.deleteRecipeSubrecipes(recipeId);
    await recipeSubrecipe.deleteRecipeSubrecipesBySubrecipeId(recipeId);  // is that right?
    await recipe.deleteRecipe(recipeId);

    await recipeSearch.deleteRecipe(recipeId);

    res.send('Recipe deleted.');
  }
};

module.exports = staffRecipeController;