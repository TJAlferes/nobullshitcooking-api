import { assert, defaulted, number, string } from 'superstruct';

import { GenerateId, Id, Description, Image } from './shared';

export class Recipe {
  private id;
  private recipeTypeId;
  private cuisineId;
  private authorId;
  private ownerId;
  private title;
  private description;
  private activeTime;
  private totalTime;
  private directions;
  // Is it really best to limit images to 4 jpg/png/webp? What about gif?
  private recipeImage;
  private equipmentImage;
  private ingredientsImage;
  private cookingImage;
  private video;

  private constructor(params: RecipeParams) {
    this.id               = GenerateId();
    this.authorId         = Id(params.authorId);
    this.ownerId          = Id(params.ownerId);
    this.description      = Description(params.description);
    this.recipeImage      = Image(params.recipeImage);
    this.equipmentImage   = Image(params.equipmentImage);
    this.ingredientsImage = Image(params.ingredientsImage);
    this.cookingImage     = Image(params.cookingImage);
  }

  static create(params: RecipeParams) {
    const recipe = new Recipe(params);
    return recipe;  // only return id ???
  }
}

/*export const validRecipe = object({
  recipeTypeId:     number(),
  cuisineId:        number(),
  title:            string(),
  activeTime:       string(),
  totalTime:        string(),
  directions:       string(),
  video:            defaulted(string(), '')
});*/

type RecipeParams = {
  recipeTypeId:     number;
  cuisineId:        number;
  authorId:         string;
  ownerId:          string;
  title:            string;
  description:      string;
  activeTime:       string;
  totalTime:        string;
  directions:       string;
  recipeImage:      string;
  equipmentImage:   string;
  ingredientsImage: string;
  cookingImage:     string;
  video:            string;
};
