import { Router } from 'express';
import { query } from 'express-validator';
import { Pool } from 'mysql2/promise';

import { SearchController } from '../controllers';
import { catchExceptions } from '../lib/utils';

const router = Router();

// for /search/...

export function searchRouter(pool: Pool) {
  const controller = new SearchController(pool);

  const sanitizeTerm =              querySanitizer('term');
  const sanitizeEquipmentFilters =  querySanitizer('filters.equipmentTypes.*');
  const sanitizeIngredientFilters = querySanitizer('filters.ingredientTypes.*');
  const sanitizeRecipeFilters =     querySanitizer(['filters.recipeTypes.*', 'filters.methods.*', 'filters.cuisines.*']);
  const sanitizeProductFilters =    querySanitizer(['filters.productTypes.*', 'filters.productCategories.*']);
  const sanitizeSorts =             querySanitizer('sorts.*');
  const sanitizeResultsPerPage =    querySanitizer('resultsPerPage');
  const sanitizeCurrentPage =       querySanitizer('currentPage');
  const defaults = [sanitizeTerm, sanitizeSorts, sanitizeResultsPerPage, sanitizeCurrentPage]

  router.post('/auto/equipment',   [sanitizeTerm], catchExceptions(controller.autoEquipment));
  router.post('/auto/ingredients', [sanitizeTerm], catchExceptions(controller.autoIngredients));
  router.post('/auto/recipes',     [sanitizeTerm], catchExceptions(controller.autoRecipes));
  router.post('/auto/products',    [sanitizeTerm], catchExceptions(controller.autoProducts));
  
  router.post('/find/equipment',   [...defaults, sanitizeEquipmentFilters],  catchExceptions(controller.searchEquipment));
  router.post('/find/ingredients', [...defaults, sanitizeIngredientFilters], catchExceptions(controller.searchIngredients));
  router.post('/find/recipes',     [...defaults, sanitizeRecipeFilters],     catchExceptions(controller.searchRecipes));
  router.post('/find/products',    [...defaults, sanitizeProductFilters],    catchExceptions(controller.searchProducts));

  return router;
}

function querySanitizer(params: string | string[]) {
  return query(params).trim().escape().optional({nullable: true, checkFalsy: true});
}
