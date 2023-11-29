import { RowDataPacket } from 'mysql2/promise';
import { assert, array, Infer, object, optional, string } from 'superstruct';

import { ValidationException } from '../../utils/exceptions';
// TO DO: FINISH

export function AutosuggestTerm(term: string) {
  assert(term, string());
  if (term.length < 3) {
    throw new ValidationException('Autosuggest term must be at least 3 characters in length.');
  }
  if (term.length > 100) {
    throw new ValidationException('Autosuggest term must be at most 100 characters in length.');
  }
  return term;
}

export const validSearchRequest = object({
  term:             optional(string()),
  current_page:     optional(string()),
  results_per_page: optional(string()),
  sorts:            optional(object({})),  // TO DO: FINISH
  filters:          optional(object({
    equipment_types:    optional(array(string())),
    ingredient_types:   optional(array(string())),
    recipe_types:       optional(array(string())),
    methods:            optional(array(string())),
    cuisines:           optional(array(string()))
  }))
});

export type SearchRequest = Infer<typeof validSearchRequest>;

/*export type SearchRequest = {
  term?:           string;    // setTerm
  filters?:        {
    //[index: string]: string[];
    equipmentTypes?:    string[],
    ingredientTypes?:   string[],
    recipeTypes?:       string[],
    methods?:           string[],
    cuisines?:          string[]
  };
  sorts?:          {};
  currentPage?:    string;  // setCurrentPage     // OFFSET in MySQL = (currentPage - 1) * resultsPerPage
  resultsPerPage?: string;  // setResultsPerPage  // LIMIT  in MySQL = resultsPerPage
};*/

export type SearchResponse = {
  results:       RowDataPacket[];
  total_results: number;
  total_pages:   number;
};
