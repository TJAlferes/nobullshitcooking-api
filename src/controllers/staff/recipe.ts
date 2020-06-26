import { Request, Response } from 'express';
import { assert } from 'superstruct';

import { RecipeSearch } from '../../elasticsearch-access/RecipeSearch';
import { esClient } from '../../lib/connections/elasticsearchClient';
import { pool } from '../../lib/connections/mysqlPoolConnection';
import { createRecipeService } from '../../lib/services/create-recipe';
import { updateRecipeService } from '../../lib/services/update-recipe';
import { validRecipeEntity } from '../../lib/validations/recipe/recipeEntity';
import { Recipe } from '../../mysql-access/Recipe';
import { RecipeEquipment } from '../../mysql-access/RecipeEquipment';
import { RecipeIngredient } from '../../mysql-access/RecipeIngredient';
import { RecipeMethod } from '../../mysql-access/RecipeMethod';
import { RecipeSubrecipe } from '../../mysql-access/RecipeSubrecipe';
import { FavoriteRecipe } from '../../mysql-access/FavoriteRecipe';
import { SavedRecipe } from '../../mysql-access/SavedRecipe';

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

    const recipeToCreate = {
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
    };

    assert(recipeToCreate, validRecipeEntity)

    await createRecipeService({
      ownerId,
      recipeToCreate,
      requiredMethods,
      requiredEquipment,
      requiredIngredients,
      requiredSubrecipes
    });

    return res.send({message: 'Recipe created.'});
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

    const recipeToUpdateWith = {
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
    };

    assert(recipeToUpdateWith, validRecipeEntity);

    await updateRecipeService({
      recipeId,
      authorId,
      ownerId,
      recipeToUpdateWith,
      requiredMethods,
      requiredEquipment,
      requiredIngredients,
      requiredSubrecipes
    });

    return res.send({message: 'Recipe updated.'});
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

    // what about plans???
    await Promise.all([
      favoriteRecipe.deleteAllFavoritesOfRecipe(recipeId),
      savedRecipe.deleteAllSavesOfRecipe(recipeId),
      recipeMethod.deleteRecipeMethods(recipeId),
      recipeEquipment.deleteRecipeEquipment(recipeId),
      recipeIngredient.deleteRecipeIngredients(recipeId),
      recipeSubrecipe.deleteRecipeSubrecipes(recipeId),
      recipeSubrecipe.deleteRecipeSubrecipesBySubrecipeId(recipeId)
    ]);

    await recipe.deleteRecipe(recipeId);

    await recipeSearch.deleteRecipe(String(recipeId));

    return res.send({message: 'Recipe deleted.'});
  }
};