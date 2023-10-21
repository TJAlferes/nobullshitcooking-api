import { NumberId, UUIDv7StringId } from '../../shared/model.js';

export class RecipeMethod {
  private recipe_id;
  private method_id;

  private constructor(params: ConstructorParams) {
    this.recipe_id = UUIDv7StringId(params.recipe_id);
    this.method_id = NumberId(params.method_id);
  }

  static create(params: CreateParams) {
    return new RecipeMethod(params);
  }

  getDTO() {
    return {
      recipe_id: this.recipe_id,
      method_id: this.method_id
    };
  }
}

type CreateParams = {
  recipe_id: string;
  method_id: number;
};

type ConstructorParams = CreateParams;
