import { assert, defaulted, string } from 'superstruct';

import { GenerateUUIDv7StringId, UUIDv7StringId, NumberId, Notes } from '../shared/model.js';

export class Ingredient {
  private ingredient_id;
  private ingredient_type_id;
  private owner_id;
  private ingredient_brand;
  private ingredient_variety;
  private ingredient_name;
  private notes;
  private image_id;

  private constructor(params: ConstructorParams) {
    this.ingredient_id      = UUIDv7StringId(params.ingredient_id);
    this.ingredient_type_id = NumberId(params.ingredient_type_id);
    this.owner_id           = UUIDv7StringId(params.owner_id);
    this.ingredient_brand   = IngredientBrand(params.ingredient_brand);
    this.ingredient_variety = IngredientVariety(params.ingredient_variety);
    this.ingredient_name    = IngredientName(params.ingredient_name);
    this.notes              = Notes(params.notes);
    this.image_id           = UUIDv7StringId(params.image_id);
  }

  static create(params: CreateParams) {
    const ingredient_id = GenerateUUIDv7StringId();
    return new Ingredient({...params, ingredient_id});
  }

  static update(params: UpdateParams) {
    return new Ingredient(params);
  }

  getDTO() {
    return {
      ingredient_id:      this.ingredient_id,
      ingredient_type_id: this.ingredient_type_id,
      owner_id:           this.owner_id,
      ingredient_brand:   this.ingredient_brand,
      ingredient_variety: this.ingredient_variety,
      ingredient_name:    this.ingredient_name,
      notes:              this.notes,
      image_id:           this.image_id
    };
  }
}

export function IngredientBrand(brand: string) {
  assert(brand, defaulted(string(), ''));
  if (brand.length > 50) {
    throw new Error("Ingredient brand must be no more than 50 characters.");
  }
  return brand;
}

export function IngredientVariety(variety: string) {
  assert(variety, defaulted(string(), ''));
  if (variety.length > 50) {
    throw new Error("Ingredient variety must be no more than 50 characters.");
  }
  return variety;
}

export function IngredientName(name: string) {
  assert(name, string());
  if (name.length > 50) {
    throw new Error("Ingredient name must be no more than 50 characters.");
  }
  return name;
}

type CreateParams = {
  ingredient_type_id: number;
  owner_id:           string;
  ingredient_brand:   string;
  ingredient_variety: string;
  ingredient_name:    string;
  notes:              string;
  image_id:           string;
};

type UpdateParams = CreateParams & {
  ingredient_id: string;
}

type ConstructorParams = UpdateParams;
