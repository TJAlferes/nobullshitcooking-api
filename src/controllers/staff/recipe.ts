import { Request, Response } from 'express';

import { pool } from '../../lib/connections/mysqlPoolConnection';
import { esClient } from '../../lib/connections/elasticsearchClient';

const Recipe = require('../../mysql-access/Recipe');
const RecipeMethod = require('../../mysql-access/RecipeMethod');
const RecipeEquipment = require('../../mysql-access/RecipeEquipment');
const RecipeIngredient = require('../../mysql-access/RecipeIngredient');
const RecipeSubrecipe = require('../../mysql-access/RecipeSubrecipe');
const FavoriteRecipe = require('../../mysql-access/FavoriteRecipe');
const SavedRecipe = require('../../mysql-access/SavedRecipe');

const RecipeSearch = require('../../elasticsearch-access/RecipeSearch');

import { createRecipeService } from '../../lib/services/create-recipe';
import { updateRecipeService } from '../../lib/services/update-recipe';

const validRecipeEntity = require('../../lib/validations/recipe/recipeEntity');

export const staffRecipeController = {
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

    await createRecipeService({
      ownerId,
      recipeToCreate,
      requiredMethods,
      requiredEquipment,
      requiredIngredients,
      requiredSubrecipes
    });

    res.send({message: 'Recipe created.'});
  },
  updateRecipe: async function(req: Request, res: Response) {
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

    const authorId = 1;
    const ownerId = 1;

    if (typeof recipeId === "undefined") {
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

    await updateRecipeService({
      recipeId,
      ownerId,
      recipeToUpdateWith,
      requiredMethods,
      requiredEquipment,
      requiredIngredients,
      requiredSubrecipes
    });

    res.send('Recipe updated.');
  },
  deleteRecipe: async function(req: Request, res: Response) {
    const recipeId = Number(req.body.recipeId);

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