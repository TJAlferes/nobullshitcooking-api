import { Router } from 'express';
import { query }  from 'express-validator';

import { SearchController } from './controller';
import { catchExceptions }  from '../../utils';

const router = Router();

// for /search/...

export function searchRouter() {
  const controller = new SearchController();

  const sanitizeTerm              = query('term').trim().escape().notEmpty();
  const sanitizeSorts             = querySanitizer('sorts.*');
  const sanitizeResultsPerPage    = querySanitizer('resultsPerPage');
  const sanitizeCurrentPage       = querySanitizer('currentPage');
  const sanitizeEquipmentFilters  = querySanitizer('filters.equipmentTypes.*');
  const sanitizeIngredientFilters = querySanitizer('filters.ingredientTypes.*');
  const sanitizeRecipeFilters     = querySanitizer([
    'filters.recipeTypes.*',
    'filters.methods.*',
    'filters.cuisines.*'
  ]);

  const defaults = [
    sanitizeTerm,
    sanitizeSorts,
    sanitizeResultsPerPage,
    sanitizeCurrentPage
  ];

  router.get('/auto/equipment',   [sanitizeTerm], catchExceptions(controller.autosuggestEquipment));
  router.get('/auto/ingredients', [sanitizeTerm], catchExceptions(controller.autosuggestIngredients));
  router.get('/auto/recipes',     [sanitizeTerm], catchExceptions(controller.autosuggestRecipes));
  
  router.get('/find/equipment',   [...defaults, sanitizeEquipmentFilters],  catchExceptions(controller.searchEquipment));
  router.get('/find/ingredients', [...defaults, sanitizeIngredientFilters], catchExceptions(controller.searchIngredients));
  router.get('/find/recipes',     [...defaults, sanitizeRecipeFilters],     catchExceptions(controller.searchRecipes));

  return router;
}

function querySanitizer(params: string | string[]) {  // sanitizeParams ?
  return query(params).trim().escape().optional({nullable: true, checkFalsy: true});
}
