import { Request, Response } from 'express';

import { pool } from '../lib/connections/mysqlPoolConnection';
import { ContentType } from '../mysql-access/ContentType';
import { Cuisine } from '../mysql-access/Cuisine';
import { Equipment } from '../mysql-access/Equipment';
import { EquipmentType } from '../mysql-access/EquipmentType';
import { Ingredient } from '../mysql-access/Ingredient';
import { IngredientType } from '../mysql-access/IngredientType';
import { Measurement } from '../mysql-access/Measurement';
import { Method } from '../mysql-access/Method';
import { Recipe } from '../mysql-access/Recipe';
import { RecipeType } from '../mysql-access/RecipeType';

export const dataInitController = {
  viewInitialData: async function(req: Request, res: Response) {
    const authorId = 1;
    const ownerId = 1;

    const contentType = new ContentType(pool);
    const cuisine = new Cuisine(pool);
    const equipment = new Equipment(pool);
    const equipmentType = new EquipmentType(pool);
    const ingredient = new Ingredient(pool);
    const ingredientType = new IngredientType(pool);
    const measurement = new Measurement(pool);
    const method = new Method(pool);
    const recipe = new Recipe(pool);
    const recipeType = new RecipeType(pool);

    const [
      contentTypes,
      cuisines,
      officialEquipment,
      equipmentTypes,
      officialIngredients,
      ingredientTypes,
      measurements,
      methods,
      officialRecipes,
      recipeTypes
    ] = await Promise.all([
      contentType.view(),
      cuisine.view(),
      equipment.view(authorId, ownerId),
      equipmentType.view(),
      ingredient.view(authorId, ownerId),
      ingredientType.view(),
      measurement.view(),
      method.view(),
      recipe.view(authorId, ownerId),
      recipeType.view()
    ]);

    return res.send({
      contentTypes,
      cuisines,
      officialEquipment,
      equipmentTypes,
      officialIngredients,
      ingredientTypes,
      measurements,
      methods,
      officialRecipes,
      recipeTypes
    });
  }
};