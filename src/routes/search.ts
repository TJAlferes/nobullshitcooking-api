import { Router } from 'express';
import { body } from 'express-validator';
import { Pool } from 'mysql2/promise';

import { SearchController } from '../controllers';
import { catchExceptions } from '../lib/utils';

const router = Router();

// for /search/...

export function searchRouter(pool: Pool) {
  const controller = new SearchController(pool);
  const sanitize = body('term').not().isEmpty().trim().escape();

  router.post('/auto/equipment',   [sanitize], catchExceptions(controller.autoEquipment));
  router.post('/auto/ingredients', [sanitize], catchExceptions(controller.autoIngredients));
  router.post('/auto/recipes',     [sanitize], catchExceptions(controller.autoRecipes));
  
  router.post('/find/equipment',   [sanitize], catchExceptions(controller.searchEquipment));
  router.post('/find/ingredients', [sanitize], catchExceptions(controller.searchIngredients));
  router.post('/find/recipes',     [sanitize], catchExceptions(controller.searchRecipes));

  return router;
}