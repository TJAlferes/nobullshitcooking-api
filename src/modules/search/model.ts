import { RowDataPacket } from 'mysql2/promise';
import { array, Infer, number, object, optional, string } from 'superstruct';

export const validSearchTerm = string();

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
    cuisines:           optional(array(string())),
    product_categories: optional(array(string())),
    product_types:      optional(array(string()))
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
    cuisines?:          string[],
    productCategories?: string[],
    productTypes?:      string[]
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
