import { Router } from 'express';
import { query } from 'express-validator';
import { Pool } from 'mysql2/promise';

import { SearchController } from '../controllers';
import { catchExceptions } from '../lib/utils';

const router = Router();

// for /search/...

export function searchRouter(pool: Pool) {
  const controller = new SearchController(pool);

  const sanitizeTerm =              query('term').not().isEmpty().trim().escape();
  const sanitizeEquipmentFilters =  query('equipmentTypes.*').notEmpty().trim().escape();
  const sanitizeIngredientFilters = query('ingredientTypes.*').notEmpty().trim().escape();
  const sanitizeRecipeFilters =     query(['recipeTypes.*', 'methods.*', 'cuisines.*']).not().isEmpty().trim().escape();
  const sanitizeProductFilters =    query(['productTypes.*', 'productCategories.*']).not().isEmpty().trim().escape();

  router.post('/auto/equipment',   [sanitizeTerm], catchExceptions(controller.autoEquipment));
  router.post('/auto/ingredients', [sanitizeTerm], catchExceptions(controller.autoIngredients));
  router.post('/auto/recipes',     [sanitizeTerm], catchExceptions(controller.autoRecipes));
  router.post('/auto/products',    [sanitizeTerm], catchExceptions(controller.autoProducts));
  
  router.post('/find/equipment',   [sanitizeTerm, sanitizeEquipmentFilters], catchExceptions(controller.searchEquipment));
  router.post('/find/ingredients', [sanitizeTerm, sanitizeIngredientFilters], catchExceptions(controller.searchIngredients));
  router.post('/find/recipes',     [sanitizeTerm, sanitizeRecipeFilters], catchExceptions(controller.searchRecipes));
  router.post('/find/products',    [sanitizeTerm, sanitizeProductFilters], catchExceptions(controller.searchProducts));

  return router;
}
