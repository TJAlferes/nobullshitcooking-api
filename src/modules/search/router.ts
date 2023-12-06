import { Router } from 'express';
import { query } from 'express-validator';

import { catchExceptions } from '../../utils';
import { searchController } from './controller';

const router = Router();

// for /search

export function searchRouter() {
  router.get(
    '/auto',
    [sanitizeIndex, sanitizeAutosuggestTerm],
    catchExceptions(searchController.autosuggest)
  );
  
  router.get(
    '/find',
    [...defaults],
    catchExceptions(searchController.search)
  );

  return router;
}

const sanitizeIndex = query('index').trim().notEmpty();

const sanitizeAutosuggestTerm = query('term').trim().notEmpty();

const sanitizeSearchTerm = sanitizeQuery('term');
const sanitizeFilters = sanitizeQuery('filters.*.*');  // TO DO: test well
const sanitizeSorts = sanitizeQuery('sorts.*');
const sanitizeCurrentPage = sanitizeQuery('current_page');
const sanitizeResultsPerPage = sanitizeQuery('results_per_page');
const defaults = [
  sanitizeIndex,
  sanitizeSearchTerm,
  sanitizeFilters,
  sanitizeSorts,
  sanitizeCurrentPage,
  sanitizeResultsPerPage
];

function sanitizeQuery(qs: string | string[]) {
  return query(qs)
    .trim()
    .optional({
      nullable: true,
      checkFalsy: true
    });
}
