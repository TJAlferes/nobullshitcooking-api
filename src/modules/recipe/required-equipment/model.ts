import { Amount, UUIDv7StringId } from '../../shared/model.js';

export class RecipeEquipment {
  private recipe_id;
  private amount;
  private equipment_id;

  private constructor(params: ConstructorParams) {
    this.recipe_id    = UUIDv7StringId(params.recipe_id);
    this.amount       = params.amount ? Amount(params.amount) : null;
    this.equipment_id = UUIDv7StringId(params.equipment_id);
  }

  static create(params: CreateParams) {
    return new RecipeEquipment(params);
  }

  getDTO() {
    return {
      recipe_id:    this.recipe_id,
      amount:       this.amount,
      equipment_id: this.equipment_id
    };
  }
}

type CreateParams = {
  recipe_id:    string;
  amount:       number | null;
  equipment_id: string;
};

type ConstructorParams = CreateParams;
