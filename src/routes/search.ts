import { Router } from 'express';
import { Pool } from 'mysql2/promise';

import { SearchController } from '../controllers';
import { catchExceptions } from '../lib/utils';

const router = Router();

// for /search/...

export function searchRouter(pool: Pool) {
  const controller = new SearchController(pool);

  //router.post('/auto/equipment',   catchExceptions(controller.autoEquipment));
  //router.post('/auto/ingredients', catchExceptions(controller.autoIngredients));
  //router.post('/auto/recipes',     catchExceptions(controller.autoRecipes));
  
  router.post('/equipment',   catchExceptions(controller.searchEquipment));
  router.post('/ingredients', catchExceptions(controller.searchIngredients));
  router.post('/recipes',     catchExceptions(controller.searchRecipes));

  return router;
}