import { Amount, NumberId, UUIDv7StringId } from '../../shared/model.js';

export class RecipeIngredient {
  private recipe_id;
  private amount;
  private unit_id;
  private ingredient_id;

  private constructor(params: ConstructorParams) {
    this.recipe_id     = UUIDv7StringId(params.recipe_id);
    this.amount        = params.amount ? Amount(params.amount) : null;
    this.unit_id       = params.unit_id ? NumberId(params.unit_id) : null;
    this.ingredient_id = UUIDv7StringId(params.ingredient_id);
  }

  static create(params: CreateParams) {
    return new RecipeIngredient(params);
  }

  getDTO() {
    return {
      recipe_id:     this.recipe_id,
      amount:        this.amount,
      unit_id:       this.unit_id,
      ingredient_id: this.ingredient_id
    };
  }
}

type CreateParams = {
  recipe_id:     string;
  amount:        number | null;
  unit_id:       number | null;
  ingredient_id: string;
};

type ConstructorParams = CreateParams;
