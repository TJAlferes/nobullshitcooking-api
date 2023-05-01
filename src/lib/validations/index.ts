import { RowDataPacket } from 'mysql2/promise';
import { array, Infer, number, object, optional, string } from 'superstruct';

export const validRecipeMethod =     object({recipeId: number(), id: number()});
export const validRecipeEquipment =  object({recipeId: number(), amount: number(), id: number()});
export const validRecipeIngredient = object({recipeId: number(), amount: number(), measurementId: number(), id: number()});
export const validRecipeSubrecipe =  object({recipeId: number(), amount: number(), measurementId: number(), id: number()});

export const validFavoriteRecipe = object({userId: number(), recipeId: number()});
export const validSavedRecipe =    object({userId: number(), recipeId: number()});

export const validSearchTerm = string();

export const validSearchRequest = object({
  term:           optional(string()),
  filters:        optional(object({
    equipmentTypes:    optional(array(string())),
    ingredientTypes:   optional(array(string())),
    recipeTypes:       optional(array(string())),
    methods:           optional(array(string())),
    cuisines:          optional(array(string())),
    productCategories: optional(array(string())),
    productTypes:      optional(array(string()))
  })),
  sorts:          optional(object({})),  // TO DO: FINISH
  currentPage:    optional(string()),
  resultsPerPage: optional(string())
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
  results:      RowDataPacket[];
  totalResults: number;
  totalPages:   number;
};
