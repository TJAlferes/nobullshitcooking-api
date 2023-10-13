import { Router } from 'express';
import { query }  from 'express-validator';

import { searchController } from './controller.js';
import { catchExceptions }  from '../../utils/index.js';

const router = Router();

// for /search

export function searchRouter() {
  router.get(
    '/auto/equipment',
    [sanitizeTerm],
    catchExceptions(searchController.autosuggestEquipment)
  );

  router.get(
    '/auto/ingredients',
    [sanitizeTerm],
    catchExceptions(searchController.autosuggestIngredients)
  );

  router.get(
    '/auto/recipes',
    [sanitizeTerm],
    catchExceptions(searchController.autosuggestRecipes)
  );
  
  router.get(
    '/find/equipment',
    [...defaults, sanitizeEquipmentFilters],
    catchExceptions(searchController.searchEquipment)
  );

  router.get(
    '/find/ingredients',
    [...defaults, sanitizeIngredientFilters],
    catchExceptions(searchController.searchIngredients)
  );

  router.get(
    '/find/recipes',
    [...defaults, sanitizeRecipeFilters],
    catchExceptions(searchController.searchRecipes)
  );

  return router;
}

function querySanitizer(params: string | string[]) {  // sanitizeParams ?
  return query(params)
    .trim()
    .escape()
    .optional({
      nullable:   true,
      checkFalsy: true
    });
}

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
