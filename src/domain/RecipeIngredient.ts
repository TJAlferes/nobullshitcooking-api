import { Amount, NumberId, UUIDv7StringId } from './shared';

export class RecipeIngredient {
  private recipe_id;
  private amount;
  private unit_id;
  private ingredient_id;

  private constructor(params: ConstructorParams) {
    this.recipe_id     = UUIDv7StringId(params.recipe_id);
    this.amount        = params.amount ? Amount(params.amount) : undefined;
    this.unit_id       = params.unit_id ? NumberId(params.unit_id) : undefined;
    this.ingredient_id = UUIDv7StringId(params.ingredient_id);
  }

  static create(params: CreateParams) {
    const recipeIngredient = new RecipeIngredient(params);
    return recipeIngredient;
  }
}

type CreateParams = {
  recipe_id:     string;
  amount?:       number;
  unit_id?:      number;
  ingredient_id: string;
};

type ConstructorParams = CreateParams;
