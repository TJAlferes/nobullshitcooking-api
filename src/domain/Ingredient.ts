import { assert, defaulted, number, string } from 'superstruct';

import { Id, AuthorId, OwnerId, Description, Image } from './shared';

export class Ingredient {
  private id;
  private ingredientTypeId;
  private authorId;
  private ownerId;
  private brand;
  private variety;
  private name;
  private alternativeNames;  // should NOT be here, should be in a separate view model or DTO
  private description;
  private image;

  private constructor(params: IngredientParams) {
    this.id               = Id();
    this.ingredientTypeId = IngredientTypeId(params.ingredientTypeId);
    this.authorId         = AuthorId(params.authorId);
    this.ownerId          = OwnerId(params.ownerId);
    this.brand            = IngredientBrand(params.brand);
    this.variety          = IngredientVariety(params.variety)
    this.name             = IngredientName(params.name);
    this.alternativeNames = IngredientAlternativeNames(params.alternativeNames);
    this.description      = Description(params.description);
    this.image            = Image(params.image);
  }

  static create(params: IngredientParams) {
    const ingredient = new Ingredient(params);
    return ingredient;  // only return id ???
  }
}

export function IngredientTypeId(ingredientTypeId: number) {
  assert(ingredientTypeId, number());
  return ingredientTypeId;
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

export function IngredientAlternativeNames(alternativeNames: string[]) {
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
}

type IngredientParams = {
  ingredientTypeId: number;
  authorId:         string;
  ownerId:          string;
  brand:            string;
  variety:          string;
  name:             string;
  alternativeNames: string[];
  description:      string;
  image:            string;
};
