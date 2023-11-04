import { assert, number } from 'superstruct';

import { ValidationException } from '../../../utils/exceptions.js';
import { UUIDv7StringId } from '../../shared/model.js';

export class RecipeImage {
  private recipe_id;
  private image_id;
  private type;

  private constructor(params: ConstructorParams) {
    this.recipe_id = UUIDv7StringId(params.recipe_id);
    this.image_id  = UUIDv7StringId(params.image_id);
    this.type      = RecipeImageType(params.type);
  }

  static create(params: CreateParams) {
    return new RecipeImage(params);
  }

  getDTO() {
    return {
      recipe_id: this.recipe_id,
      image_id:  this.image_id,
      type:      this.type
    };
  }
}

function RecipeImageType(type: number) {
  assert(type, number());
  if (type === 1) return type;  // 1 image of completed and plated recipe (primary image)
  if (type === 2) return type;  // 1 image of required equipment image
  if (type === 3) return type;  // 1 image of required ingredients image
  if (type === 4) return type;  // 1 image of prepping/cooking detail/process/action
  throw ValidationException("Invalid recipe image type.");
}

type CreateParams = {
  recipe_id: string;
  image_id:  string;
  type:      number;
};

type ConstructorParams = CreateParams;
