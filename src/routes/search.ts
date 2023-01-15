import { Router } from 'express';
import { Pool } from 'mysql2/promise';

import { SearchController } from '../controllers';
import { catchExceptions } from '../lib/utils';

const router = Router();

// for /search/...

export function searchRouter(pool: Pool) {
  const controller = new SearchController(pool);

  router.post('/auto/equipment',   catchExceptions(controller.autoEquipment));
  router.post('/auto/ingredients', catchExceptions(controller.autoIngredients));
  router.post('/auto/recipes',     catchExceptions(controller.autoRecipes));
  
  router.post('/find/equipment',   catchExceptions(controller.findEquipment));
  router.post('/find/ingredients', catchExceptions(controller.findIngredients));
  router.post('/find/recipes',     catchExceptions(controller.findRecipes));

  return router;
}