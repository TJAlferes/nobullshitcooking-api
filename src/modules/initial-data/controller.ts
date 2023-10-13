import { Request, Response } from 'express';

import { NOBSC_USER_ID }      from '../shared/model.js';
import { EquipmentRepo }      from '../equipment/repo.js';
import { EquipmentTypeRepo }  from '../equipment/type/repo.js';
import { IngredientRepo }     from '../ingredient/repo.js';
import { IngredientTypeRepo } from '../ingredient/type/repo.js';
import { RecipeRepo }         from '../recipe/repo.js';
import { CuisineRepo }        from '../recipe/cuisine/repo.js';
import { MethodRepo }         from '../recipe/method/repo.js';
import { RecipeTypeRepo }     from '../recipe/type/repo.js';
import { UnitRepo }           from '../shared/unit/repo.js';

export const initialDataController = {
  async view(req: Request, res: Response) {
    const author_id = NOBSC_USER_ID;
    const owner_id  = NOBSC_USER_ID;

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
      equipmentRepo.viewAll(owner_id),
      equipmentTypeRepo.viewAll(),
      ingredientRepo.viewAll(owner_id),
      ingredientTypeRepo.viewAll(),
      unitRepo.viewAll(),
      methodRepo.viewAll(),
      recipeRepo.overviewAll({author_id, owner_id}),
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
};
