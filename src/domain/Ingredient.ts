import { assert, defaulted, string } from 'superstruct';

import { GenerateUUIDv7StringId, UUIDv7StringId, NumberId, Description } from './shared';

export class Ingredient {
  private ingredient_id;
  private ingredient_type_id;
  private author_id;
  private owner_id;
  private ingredient_brand;
  private ingredient_variety;
  private ingredient_name;
  //private alternativeNames;  // should NOT be here, should be in a separate view model or DTO
  private description;
  private image_id;

  private constructor(params: ConstructorParams) {
    this.ingredient_id      = UUIDv7StringId(params.ingredient_id);
    this.ingredient_type_id = NumberId(params.ingredient_type_id);
    this.author_id          = UUIDv7StringId(params.author_id);
    this.owner_id           = UUIDv7StringId(params.owner_id);
    this.ingredient_brand   = IngredientBrand(params.ingredient_brand);
    this.ingredient_variety = IngredientVariety(params.ingredient_variety)
    this.ingredient_name    = IngredientName(params.ingredient_name);
    this.description        = Description(params.description);
    this.image_id           = UUIDv7StringId(params.image_id);
  }

  static create(params: CreateParams) {
    const ingredient_id = GenerateUUIDv7StringId();

    const ingredient = new Ingredient({...params, ingredient_id});

    return ingredient;  // only return id ???
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

//alternative_names: string[];
/*export function IngredientAlternativeNames(alternativeNames: string[]) {
  if (alternativeNames.length < 1) {
    return [];
  }
  if (alternativeNames.length > 50) {
    throw new Error("Ingredient must have no more than 50 alternative names.");
  }
  alternativeNames.forEach(altName => {
    assert(altName, string());
    if (altName.length > 50) {
      throw new Error("Ingredient alternative name must be no more than 50 characters.");
    }
  });
  return alternativeNames;
}*/

type CreateParams = {
  ingredient_type_id: number;
  author_id:          string;
  owner_id:           string;
  ingredient_brand:   string;
  ingredient_variety: string;
  ingredient_name:    string;
  description:        string;
  image_id:           string;
};

type UpdateParams = CreateParams & {
  ingredient_id: string;
}

type ConstructorParams = UpdateParams;
