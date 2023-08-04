import { Router } from 'express';
import { query }  from 'express-validator';

import { SearchController } from '../controllers';
import { catchExceptions }  from '../lib/utils';

const router = Router();

// for /search/...

export function searchRouter() {
  const controller = new SearchController();

  const sanitizeTerm =              query('term').trim().escape().notEmpty();
  const sanitizeEquipmentFilters =  querySanitizer('filters.equipmentTypes.*');
  const sanitizeIngredientFilters = querySanitizer('filters.ingredientTypes.*');
  const sanitizeRecipeFilters =     querySanitizer(['filters.recipeTypes.*', 'filters.methods.*', 'filters.cuisines.*']);
  //const sanitizeProductFilters =    querySanitizer(['filters.productTypes.*', 'filters.productCategories.*']);
  const sanitizeSorts =             querySanitizer('sorts.*');
  const sanitizeResultsPerPage =    querySanitizer('resultsPerPage');
  const sanitizeCurrentPage =       querySanitizer('currentPage');
  const defaults =                  [sanitizeTerm, sanitizeSorts, sanitizeResultsPerPage, sanitizeCurrentPage];

  router.get('/auto/equipment',   [sanitizeTerm], catchExceptions(controller.autoEquipment));
  router.get('/auto/ingredients', [sanitizeTerm], catchExceptions(controller.autoIngredients));
  router.get('/auto/recipes',     [sanitizeTerm], catchExceptions(controller.autoRecipes));
  //router.get('/auto/products',    [sanitizeTerm], catchExceptions(controller.autoProducts));
  
  router.get('/find/equipment',   [...defaults, sanitizeEquipmentFilters],  catchExceptions(controller.searchEquipment));
  router.get('/find/ingredients', [...defaults, sanitizeIngredientFilters], catchExceptions(controller.searchIngredients));
  router.get('/find/recipes',     [...defaults, sanitizeRecipeFilters],     catchExceptions(controller.searchRecipes));
  //router.get('/find/products',    [...defaults, sanitizeProductFilters],    catchExceptions(controller.searchProducts));

  return router;
}

function querySanitizer(params: string | string[]) {  // sanitizeParams ?
  return query(params).trim().escape().optional({nullable: true, checkFalsy: true});
}
