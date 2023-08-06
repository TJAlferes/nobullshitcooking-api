import { Request, Response } from 'express';

import {
  CuisineRepo,
  EquipmentRepo,
  EquipmentTypeRepo,
  IngredientRepo,
  IngredientTypeRepo,
  MeasurementRepo,
  MethodRepo,
  RecipeRepo,
  RecipeTypeRepo
} from '../repos/mysql';

export class DataInitController {
  async viewInitialData(req: Request, res: Response) {
    const authorId = 1;
    const ownerId =  1;

    const cuisineRepo =        new CuisineRepo();
    const equipmentRepo =      new EquipmentRepo();
    const equipmentTypeRepo =  new EquipmentTypeRepo();
    const ingredientRepo =     new IngredientRepo();
    const ingredientTypeRepo = new IngredientTypeRepo();
    const measurementRepo =    new MeasurementRepo();
    const methodRepo =         new MethodRepo();
    const recipeRepo =         new RecipeRepo();
    const recipeTypeRepo =     new RecipeTypeRepo();

    const [
      cuisines,
      equipments,
      equipmentTypes,
      ingredients,
      ingredientTypes,
      measurements,
      methods,
      recipes,
      recipeTypes
    ] = await Promise.all([
      cuisineRepo.viewAll(),
      equipmentRepo.viewAll(authorId, ownerId),
      equipmentTypeRepo.viewAll(),
      ingredientRepo.viewAll(authorId, ownerId),
      ingredientTypeRepo.viewAll(),
      measurementRepo.viewAll(),
      methodRepo.viewAll(),
      recipeRepo.viewAll(authorId, ownerId),
      recipeTypeRepo.viewAll()
    ]);

    return res.send({
      cuisines,
      equipment: equipments,
      equipmentTypes,
      ingredients,
      ingredientTypes,
      measurements,
      methods,
      recipes,
      recipeTypes
    });
  }
}
