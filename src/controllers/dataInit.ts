import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import {
  ContentType,
  Cuisine,
  Equipment,
  EquipmentType,
  Ingredient,
  IngredientType,
  Measurement,
  Method,
  Recipe,
  RecipeType
} from '../access/mysql';

export class DataInitController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewInitialData = this.viewInitialData.bind(this);
  }

  async viewInitialData(req: Request, res: Response) {
    const author = "NOBSC";
    const owner = "NOBSC";

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
      equipment.view(author, owner),
      equipmentType.view(),
      ingredient.view(author, owner),
      ingredientType.view(),
      measurement.view(),
      method.view(),
      recipe.view(author, owner),
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