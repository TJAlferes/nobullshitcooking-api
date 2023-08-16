import { NumberId, UUIDv7StringId } from './shared';

export class RecipeMethod {
  private recipe_id;
  private method_id;

  private constructor(params: ConstructorParams) {
    this.recipe_id = UUIDv7StringId(params.recipe_id);
    this.method_id = NumberId(params.method_id);
  }

  static create(params: CreateParams) {
    const recipeMethod = new RecipeMethod(params);
    return recipeMethod;
  }
}

type CreateParams = {
  recipe_id: string;
  method_id: number;
};

type ConstructorParams = CreateParams;
