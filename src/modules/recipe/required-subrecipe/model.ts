import { Amount, NumberId, UUIDv7StringId } from '../../shared/model';

export class RecipeSubrecipe {
  private recipe_id;
  private amount;
  private unit_id;
  private subrecipe_id;

  private constructor(params: ConstructorParams) {
    this.recipe_id    = UUIDv7StringId(params.recipe_id);
    this.amount       = params.amount ? Amount(params.amount) : undefined;
    this.unit_id      = params.unit_id ? NumberId(params.unit_id) : undefined;
    this.subrecipe_id = UUIDv7StringId(params.subrecipe_id);
  }

  static create(params: CreateParams) {
    const recipeSubrecipe = new RecipeSubrecipe(params);
    return recipeSubrecipe;
  }

  getDTO() {
    return {
      recipe_id:    this.recipe_id,
      amount:       this.amount,
      unit_id:      this.unit_id,
      subrecipe_id: this.subrecipe_id
    };
  }
}

type CreateParams = {
  recipe_id:    string;
  amount?:      number;
  unit_id?:     number;
  subrecipe_id: string;
};

type ConstructorParams = CreateParams;
