import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

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

export class DataInitController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewInitialData = this.viewInitialData.bind(this);
  }

  async viewInitialData(req: Request, res: Response) {
    const authorId = 1;
    const ownerId = 1;
    const contentType = new ContentType(this.pool);
    const cuisine = new Cuisine(this.pool);
    const equipment = new Equipment(this.pool);
    const equipmentType = new EquipmentType(this.pool);
    const ingredient = new Ingredient(this.pool);
    const ingredientType = new IngredientType(this.pool);
    const measurement = new Measurement(this.pool);
    const method = new Method(this.pool);
    const recipe = new Recipe(this.pool);
    const recipeType = new RecipeType(this.pool);
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
}