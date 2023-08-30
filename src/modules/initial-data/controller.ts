import { Request, Response } from 'express';

import { NOBSC_USER_ID }      from '../shared/model';
import { EquipmentRepo }      from '../equipment/repo';
import { EquipmentTypeRepo }  from '../equipment/type/repo';
import { IngredientRepo }     from '../ingredient/repo';
import { IngredientTypeRepo } from '../ingredient/type/repo';
import { RecipeRepo }         from '../recipe/repo';
import { CuisineRepo }        from '../recipe/cuisine/repo';
import { MethodRepo }         from '../recipe/method/repo';
import { RecipeTypeRepo }     from '../recipe/type/repo';
import { UnitRepo }           from '../shared/unit/repo';

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
      equipmentRepo.overviewAll(owner_id),  // viewAll fine?
      equipmentTypeRepo.viewAll(),
      ingredientRepo.overviewAll(owner_id),  // viewAll fine?
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
