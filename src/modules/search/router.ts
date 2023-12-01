import { Router } from 'express';
import { query } from 'express-validator';

import { catchExceptions } from '../../utils';
import { searchController } from './controller';

const router = Router();

// for /search

export function searchRouter() {
  router.get(
    '/auto/equipment',
    [sanitizeAutosuggestTerm],
    catchExceptions(searchController.autosuggestEquipment)
  );

  router.get(
    '/auto/ingredients',
    [sanitizeAutosuggestTerm],
    catchExceptions(searchController.autosuggestIngredients)
  );

  router.get(
    '/auto/recipes',
    [sanitizeAutosuggestTerm],
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

const sanitizeAutosuggestTerm = query('term').trim().notEmpty();

const sanitizeSearchTerm = sanitizeQuery('term');
const sanitizeResultsPerPage = sanitizeQuery('results_per_page');
const sanitizeCurrentPage = sanitizeQuery('current_page');
const sanitizeEquipmentFilters = sanitizeQuery('filters.equipment_types.*');
const sanitizeIngredientFilters = sanitizeQuery('filters.ingredient_types.*');
const sanitizeRecipeFilters = sanitizeQuery([
  'filters.recipe_types.*',
  'filters.methods.*',
  'filters.cuisines.*'
]);
const sanitizeSorts = sanitizeQuery('sorts.*');

const defaults = [
  sanitizeSearchTerm,
  sanitizeResultsPerPage,
  sanitizeCurrentPage,
  sanitizeSorts
];

function sanitizeQuery(qs: string | string[]) {
  return query(qs)
    .trim()
    .optional({
      nullable: true,
      checkFalsy: true
    });
}
