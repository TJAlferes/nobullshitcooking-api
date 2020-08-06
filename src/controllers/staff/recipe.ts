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
  create: async function(req: Request, res: Response) {
    const recipeTypeId = Number(req.body.recipeInfo.recipeTypeId);
    const cuisineId = Number(req.body.recipeInfo.cuisineId);
    const {
      title,
      description,
      activeTime,
      totalTime,
      directions,
      requiredMethods,
      requiredEquipment,
      requiredIngredients,
      requiredSubrecipes,
      recipeImage,
      equipmentImage,
      ingredientsImage,
      cookingImage
    } = req.body.recipeInfo;

    const authorId = 1;
    const ownerId = 1;

    const recipeToCreate = {
      recipeTypeId,
      cuisineId,
      authorId,
      ownerId,
      title,
      description,
      activeTime,
      totalTime,
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
  update: async function(req: Request, res: Response) {
    const id = Number(req.body.recipeInfo.id);
    const recipeTypeId = Number(req.body.recipeInfo.recipeTypeId);
    const cuisineId = Number(req.body.recipeInfo.cuisineId);
    const {
      title,
      description,
      activeTime,
      totalTime,
      directions,
      requiredMethods,
      requiredEquipment,
      requiredIngredients,
      requiredSubrecipes,
      recipeImage,
      equipmentImage,
      ingredientsImage,
      cookingImage
    } = req.body.recipeInfo;

    const authorId = 1;
    const ownerId = 1;

    if (typeof id === "undefined") {
      return res.send({message: 'Invalid recipe ID!'});
    }

    const recipeToUpdateWith = {
      recipeTypeId,
      cuisineId,
      authorId,
      ownerId,
      title,
      description,
      activeTime,
      totalTime,
      directions,
      recipeImage,
      equipmentImage,
      ingredientsImage,
      cookingImage
    };

    assert(recipeToUpdateWith, validRecipeEntity);

    await updateRecipeService({
      id,
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
  delete: async function(req: Request, res: Response) {
    const id = Number(req.body.id);

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
      favoriteRecipe.deleteAllByRecipeId(id),
      savedRecipe.deleteAllByRecipeId(id),
      recipeMethod.deleteByRecipeId(id),
      recipeEquipment.deleteByRecipeId(id),
      recipeIngredient.deleteByRecipeId(id),
      recipeSubrecipe.deleteByRecipeId(id),
      recipeSubrecipe.deleteBySubrecipeId(id)
    ]);

    await recipe.deleteById(id);

    await recipeSearch.delete(String(id));

    return res.send({message: 'Recipe deleted.'});
  }
};