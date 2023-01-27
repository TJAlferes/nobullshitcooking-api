import { Router } from 'express';
import { body } from 'express-validator';
import { Pool } from 'mysql2/promise';

import { SearchController } from '../controllers';
import { catchExceptions } from '../lib/utils';

const router = Router();

// for /search/...

export function searchRouter(pool: Pool) {
  const controller = new SearchController(pool);

  //router.post('/auto/equipment',   [body('term').not().isEmpty().trim().escape()] catchExceptions(controller.autoEquipment));
  //router.post('/auto/ingredients', [body('term').not().isEmpty().trim().escape()] catchExceptions(controller.autoIngredients));
  //router.post('/auto/recipes',     [body('term').not().isEmpty().trim().escape()] catchExceptions(controller.autoRecipes));
  
  router.post('/find/equipment',   [body('term').not().isEmpty().trim().escape()], catchExceptions(controller.searchEquipment));
  router.post('/find/ingredients', [body('term').not().isEmpty().trim().escape()], catchExceptions(controller.searchIngredients));
  router.post('/find/recipes',     [body('term').not().isEmpty().trim().escape()], catchExceptions(controller.searchRecipes));

  return router;
}