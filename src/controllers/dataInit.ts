import { Request, Response } from 'express';
import { Pool }              from 'mysql2/promise';

import { Cuisine, Equipment, EquipmentType, Ingredient, IngredientType, Measurement, Method, Recipe, RecipeType } from '../access/mysql';

export class DataInitController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async viewInitialData(req: Request, res: Response) {
    const authorId = 1;
    const ownerId =  1;

    const cuisine =        new Cuisine(this.pool);
    const equipment =      new Equipment(this.pool);
    const equipmentType =  new EquipmentType(this.pool);
    const ingredient =     new Ingredient(this.pool);
    const ingredientType = new IngredientType(this.pool);
    const measurement =    new Measurement(this.pool);
    const method =         new Method(this.pool);
    const recipe =         new Recipe(this.pool);
    const recipeType =     new RecipeType(this.pool);

    const [ cuisines, equipments, equipmentTypes, ingredients, ingredientTypes, measurements, methods, recipes, recipeTypes ] = await Promise.all([
      cuisine.viewAll(),
      equipment.viewAll(authorId, ownerId),
      equipmentType.viewAll(),
      ingredient.viewAll(authorId, ownerId),
      ingredientType.viewAll(),
      measurement.viewAll(),
      method.viewAll(),
      recipe.viewAll(authorId, ownerId),
      recipeType.viewAll()
    ]);

    return res.send({cuisines, equipment: equipments, equipmentTypes, ingredients, ingredientTypes, measurements, methods, recipes, recipeTypes});
  }
}
