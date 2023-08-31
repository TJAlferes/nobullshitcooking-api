import { assert, number } from 'superstruct';

import { UUIDv7StringId } from '../../shared/model';

export class RecipeImage {
  private recipe_id;
  private image_id;
  private type;
  private order;

  private constructor(params: ConstructorParams) {
    this.recipe_id = UUIDv7StringId(params.recipe_id);
    this.image_id  = UUIDv7StringId(params.image_id);
    this.type      = RecipeImageType(params.type);
    this.order     = RecipeImageOrder(params.order);
  }

  static create(params: CreateParams) {
    const recipeImage = new RecipeImage(params);
    return recipeImage;
  }

  getDTO() {
    return {
      recipe_id: this.recipe_id,
      image_id:  this.image_id,
      type:      this.type,
      order:     this.order
    };
  }
}

function RecipeImageType(type: number) {
  assert(type, number());
  if (type === 1) return type;
  if (type === 2) return type;
  if (type === 3) return type;
  if (type === 4) return type;
  throw new Error("Invalid recipe image type.");
}

function RecipeImageOrder(order: number) {
  assert(order, number());
  if (order === 1) return order;
  if (order === 2) return order;
  if (order === 3) return order;
  throw new Error("Invalid recipe image order.");
}

type CreateParams = {
  recipe_id: string;
  image_id:  string;
  type:      number;
  order:     number;
};

type ConstructorParams = CreateParams;
