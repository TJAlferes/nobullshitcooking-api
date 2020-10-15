import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { ContentType } from '../access/mysql/ContentType';
import { Cuisine } from '../access/mysql/Cuisine';
import { Equipment } from '../access/mysql/Equipment';
import { EquipmentType } from '../access/mysql/EquipmentType';
import { Ingredient } from '../access/mysql/Ingredient';
import { IngredientType } from '../access/mysql/IngredientType';
import { Measurement } from '../access/mysql/Measurement';
import { Method } from '../access/mysql/Method';
import { Recipe } from '../access/mysql/Recipe';
import { RecipeType } from '../access/mysql/RecipeType';

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