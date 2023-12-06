import { RowDataPacket } from 'mysql2/promise';
import { assert, array, Infer, object, optional, string } from 'superstruct';

import { ValidationException } from '../../utils/exceptions';

export function SearchIndex(index: string) {
  assert(index, string());
  if (index === 'recipes') return index;
  if (index === 'ingredients') return index;
  if (index === 'equipment') return index;
  throw new ValidationException('Invalid search index.');
}

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
  index: string(),
  term: optional(string()),
  current_page: optional(string()),
  results_per_page: optional(string()),
  sorts: optional(object({})),  // TO DO: FINISH
  filters: optional(object({
    equipment_types: optional(array(string())),
    ingredient_types: optional(array(string())),
    recipe_types: optional(array(string())),
    methods: optional(array(string())),
    cuisines: optional(array(string()))
  }))
});

export type SearchRequest = Infer<typeof validSearchRequest>;

export type SearchResponse = {
  results:       Partial<SearchResults>[];
  total_results: number;
  total_pages:   number;
};

type SearchResults = RecipeCard & EquipmentCard & IngredientCard;

export type RecipeCard = RowDataPacket & {
  recipe_id:        string;
  author:           string;
  recipe_type_name: string;
  cuisine_name:     string;
  title:            string;
  description:      string;  // ?
  image_filename:   string;
};

export type EquipmentCard = RowDataPacket & {
  equipment_id:        string;
  equipment_type_name: string;
  equipment_name:      string;
  image_filename:      string;
};

export type IngredientCard = RowDataPacket & {
  ingredient_id:        string;
  ingredient_type_name: string;
  fullname:             string;
  image_filename:       string;
};
