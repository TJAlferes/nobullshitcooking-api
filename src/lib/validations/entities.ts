import {
  array,
  defaulted,
  number,
  object,
  optional,
  string
} from 'superstruct';

export const validContent = object({
  contentTypeId: number(),
  authorId: number(),
  ownerId: number(),
  created: string(),
  published: defaulted(string(), null),
  title: string(),
  items: string()
});

export const validEquipment = object({
  equipmentTypeId: number(),
  authorId: number(),
  ownerId: number(),
  name: string(),
  description: string(),
  image: defaulted(string(), '')
});

export const validFavoriteRecipe =
  object({userId: number(), recipeId: number()});

export const validFriendship = object({
  userId: number(),
  friendId: number(),
  status1: string(),
  status2: string()
});

export const validIngredient = object({
  ingredientTypeId: number(),
  authorId: number(),
  ownerId: number(),
  brand: defaulted(string(), ''),
  variety: defaulted(string(), ''),
  name: string(),
  altNames: optional(array(string())),
  description: string(),
  image: defaulted(string(), '')
});

export const validPlan = object({
  authorId: number(),
  ownerId: number(),
  name: string(),
  data: defaulted(
    string(),
    JSON.stringify({
       1: [],  2: [],  3: [],  4: [],  5: [],  6: [],  7: [],
       8: [],  9: [], 10: [], 11: [], 12: [], 13: [], 14: [],
      15: [], 16: [], 17: [], 18: [], 19: [], 20: [], 21: [],
      22: [], 23: [], 24: [], 25: [], 26: [], 27: [], 28: []
    })
  )
});

export const validProduct = object({
  product_category_id: string(),
  product_type_id: string(),
  brand: defaulted(string(), ''),
  variety: defaulted(string(), ''),
  name: string(),
  alt_names: optional(array(string())),
  description: string(),
  //specs:
  image: defaulted(string(), '')
});

export const validRecipe = object({
  recipe_type_id: number(),
  cuisineId: number(),
  authorId: number(),
  ownerId: number(),
  title: string(),
  description: string(),
  activeTime: string(),
  totalTime: string(),
  directions: string(),
  recipeImage: defaulted(string(), ''),
  equipmentImage: defaulted(string(), ''),
  ingredientsImage: defaulted(string(), ''),
  cookingImage: defaulted(string(), ''),
  video: defaulted(string(), '')
});

export const validRecipeEquipment =
  object({recipeId: number(), equipmentId: number(), amount: number()});

export const validRecipeIngredient = object({
  recipeId: number(),
  ingredientId: number(),
  amount: number(),
  measurementId: number()
});

export const validRecipeMethod =
  object({recipeId: number(), methodId: number()});

export const validRecipeSubrecipe = object({
  recipeId: number(),
  subrecipeId: number(),
  amount: number(),
  measurementId: number()
});

export const validSavedRecipe = object({userId: number(), recipeId: number()});

export const validStaff =
  object({email: string(), pass: string(), staffname: string()});

export const validUser = object({
  email: string(),
  pass: string(),
  username: string(),
  confirmationCode: defaulted(string(), null)
});