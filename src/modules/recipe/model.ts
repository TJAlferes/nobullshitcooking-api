import { assert, string } from 'superstruct';

import { GenerateUUIDv7StringId, UUIDv7StringId, NumberId } from '../shared/model';

export class Recipe {
  private recipe_id;
  private recipe_type_id;
  private cuisine_id;
  private author_id;
  private owner_id;
  private title;
  private description;
  private active_time;
  private total_time;
  private directions;
  // NO. DO NOT DO THIS. Query the recipe_image table to find images with this recipe_id
  // and have a column which shows its type and a column which shows its order (in that type)
  private recipe_image_id;
  private equipment_image_id;
  private ingredients_image_id;
  private cooking_image_id;

  private constructor(params: ConstructorParams) {
    this.recipe_id            = UUIDv7StringId(params.recipe_id);
    this.recipe_type_id       = NumberId(params.recipe_type_id);
    this.cuisine_id           = NumberId(params.cuisine_id);
    this.author_id            = UUIDv7StringId(params.author_id);
    this.owner_id             = UUIDv7StringId(params.owner_id);
    this.title                = Title(params.title);
    this.description          = Description(params.description);
    this.active_time          = ActiveTime(params.active_time);
    this.total_time           = TotalTime(params.active_time);
    this.directions           = Directions(params.directions);
    this.recipe_image_id      = UUIDv7StringId(params.recipe_image_id);
    this.equipment_image_id   = UUIDv7StringId(params.equipment_image_id);
    this.ingredients_image_id = UUIDv7StringId(params.ingredients_image_id);
    this.cooking_image_id     = UUIDv7StringId(params.cooking_image_id);
  }

  static create(params: CreateParams) {
    const recipe_id = GenerateUUIDv7StringId();

    const recipe = new Recipe({...params, recipe_id});

    // persist HERE? using a repo interface?

    return recipe;  // only return id ???
  }

  static update(params: UpdateParams) {

  }
}

export function Title(title: string) {
  assert(title, string());
  if (title.length > 100) {
    throw new Error ("Recipe title must be no more than 100 characters.")
  }
  return title;
}

export function Description(description: string) {
  assert(description, string());
  if (description.length > 150) {
    throw new Error("Recipe description must be no more than 150 characters.");
  }
  return description;
}

export function ActiveTime(time: string) {
  assert(time, string());
  if (time.length > 8) {
    throw new Error ("Recipe active time must be no more than 8 characters.")
  }
  return time;
}

export function TotalTime(time: string) {
  assert(time, string());
  if (time.length > 8) {
    throw new Error ("Recipe total time must be no more than 8 characters.")
  }
  return time;
}

export function Directions(directions: string) {
  assert(directions, string());
  if (directions.length > 1000) {
    throw new Error("Recipe directions must be no more than 2,000 characters.");
  }
  return directions;
}

type CreateParams = {
  recipe_type_id:       number;
  cuisine_id:           number;
  author_id:            string;
  owner_id:             string;
  title:                string;
  description:          string;
  active_time:          string;
  total_time:           string;
  directions:           string;
  recipe_image_id:      string;
  equipment_image_id:   string;
  ingredients_image_id: string;
  cooking_image_id:     string;
};

type UpdateParams = CreateParams & {
  recipe_id: string;
}

type ConstructorParams = UpdateParams;
