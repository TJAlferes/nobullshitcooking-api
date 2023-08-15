import { Request, Response } from 'express';

import {
  CuisineRepo,
  EquipmentRepo,
  EquipmentTypeRepo,
  IngredientRepo,
  IngredientTypeRepo,
  UnitRepo,
  MethodRepo,
  RecipeRepo,
  RecipeTypeRepo
} from '../repos/mysql';

export class DataInitController {
  async viewInitialData(req: Request, res: Response) {
    const author_id = 1;  // TO DO: fix/finish/move to domain
    const owner_id  = 1;  // TO DO: fix/finish/move to domain

    const cuisineRepo        = new CuisineRepo();
    const equipmentRepo      = new EquipmentRepo();
    const equipmentTypeRepo  = new EquipmentTypeRepo();
    const ingredientRepo     = new IngredientRepo();
    const ingredientTypeRepo = new IngredientTypeRepo();
    const unitRepo           = new UnitRepo();
    const methodRepo         = new MethodRepo();
    const recipeRepo         = new RecipeRepo();
    const recipeTypeRepo     = new RecipeTypeRepo();

    const [
      cuisines,
      equipments,
      equipment_types,
      ingredients,
      ingredient_types,
      units,
      methods,
      recipes,
      recipe_types
    ] = await Promise.all([
      cuisineRepo.viewAll(),
      equipmentRepo.viewAll(author_id, owner_id),
      equipmentTypeRepo.viewAll(),
      ingredientRepo.viewAll(author_id, owner_id),
      ingredientTypeRepo.viewAll(),
      unitRepo.viewAll(),
      methodRepo.viewAll(),
      recipeRepo.viewAll(author_id, owner_id),
      recipeTypeRepo.viewAll()
    ]);

    return res.send({
      cuisines,
      equipment: equipments,
      equipment_types,
      ingredients,
      ingredient_types,
      units,
      methods,
      recipes,
      recipe_types
    });
  }
}
