import { UUIDv7StringId } from '../../shared/model';
import { IngredientName } from '../model';

export class IngredientAltName {
  private ingredient_id;
  private alt_name;

  private constructor(params: ConstructorParams) {
    this.ingredient_id = UUIDv7StringId(params.ingredient_id);
    this.alt_name      = IngredientName(params.alt_name);
  }

  static create(params: CreateParams) {
    return new IngredientAltName(params);
  }

  getDTO() {
    return {
      ingredient_id: this.ingredient_id,
      alt_name:      this.alt_name,
    };
  }
}

type CreateParams = {
  ingredient_id: string;
  alt_name:      string;
};

type ConstructorParams = CreateParams;
