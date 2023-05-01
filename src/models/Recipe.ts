import { defaulted, number, object, string } from 'superstruct';

export const validRecipe = object({
  recipeTypeId:     number(),
  cuisineId:        number(),
  authorId:         number(),
  ownerId:          number(),
  title:            string(),
  description:      string(),
  activeTime:       string(),
  totalTime:        string(),
  directions:       string(),
  recipeImage:      defaulted(string(), ''),
  equipmentImage:   defaulted(string(), ''),
  ingredientsImage: defaulted(string(), ''),
  cookingImage:     defaulted(string(), ''),
  video:            defaulted(string(), '')
});
