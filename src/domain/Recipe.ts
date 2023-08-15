import { assert, defaulted, number, string } from 'superstruct';

import { GenerateId, Id, Description, Image } from './shared';

export class Recipe {
  private id;
  private recipe_type_id;
  private cuisine_id;
  private author_id;
  private owner_id;
  private title;
  private description;
  private active_time;
  private total_time;
  private directions;
  //private image_id;  // of recipe_image
  // Is it really best to limit images to 4 jpg/png/webp? What about gif?
  // move to Image
  //private recipeImage;
  //private equipmentImage;
  //private ingredientsImage;
  //private cookingImage;
  // move to Video
  //private video;

  private constructor(params: ConstructorParams) {
    this.id               = GenerateId();
    this.author_id         = Id(params.author_id);
    this.owner_id          = Id(params.owner_id);
    this.description      = Description(params.description);
    //this.recipeImage      = Image(params.recipeImage);
    //this.equipmentImage   = Image(params.equipmentImage);
    //this.ingredientsImage = Image(params.ingredientsImage);
    //this.cookingImage     = Image(params.cookingImage);
  }

  static create(params: CreateParams) {
    const recipe_id = GenerateId();
    const recipe = new Recipe(params);
    return recipe;  // only return id ???
  }

  static update(params: UpdateParams) {

  }
}

type CreateParams = {
  recipe_type_id: number;
  cuisine_id:     number;
  author_id:      string;
  owner_id:       string;
  title:          string;
  description:    string;
  active_time:    string;
  total_time:     string;
  directions:     string;
};

type UpdateParams = CreateParams & {
  recipe_id: string;
}

type ConstructorParams = UpdateParams;
