import { Router } from 'express';
import { query } from 'express-validator';

import { catchExceptions } from '../../utils';
import { searchController } from './controller';

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

const sanitizeTerm = query('term').trim().escape().notEmpty();

const sanitizeSorts             = sanitizeQuery('sorts.*');
const sanitizeResultsPerPage    = sanitizeQuery('results_per_page');
const sanitizeCurrentPage       = sanitizeQuery('current_page');
const sanitizeEquipmentFilters  = sanitizeQuery('filters.equipment_types.*');
const sanitizeIngredientFilters = sanitizeQuery('filters.ingredient_types.*');
const sanitizeRecipeFilters     = sanitizeQuery([
  'filters.recipe_types.*',
  'filters.methods.*',
  'filters.cuisines.*'
]);

const defaults = [
  sanitizeTerm,
  sanitizeSorts,
  sanitizeResultsPerPage,
  sanitizeCurrentPage
];

function sanitizeQuery(params: string | string[]) {  // sanitizeParams ?
  return query(params)
    .trim()
    .escape()
    .optional({
      nullable: true,
      checkFalsy: true
    });
}
