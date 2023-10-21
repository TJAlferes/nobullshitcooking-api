import { assert, number } from "superstruct";

import { UUIDv7StringId } from '../../shared/model.js';

export class PlanRecipe {
  private plan_id;
  private recipe_id;
  private day_number;
  private recipe_number;

  private constructor(params: ConstructorParams) {
    this.plan_id       = UUIDv7StringId(params.plan_id);
    this.recipe_id     = UUIDv7StringId(params.recipe_id);
    this.day_number    = DayNumber(params.day_number);
    this.recipe_number = RecipeNumber(params.recipe_number);
  }

  static create(params: CreateParams) {
    return new PlanRecipe(params);
  }

  getDTO() {
    return {
      plan_id:       this.plan_id,
      recipe_id:     this.recipe_id,
      day_number:    this.day_number,
      recipe_number: this.recipe_number
    };
  }
}

function DayNumber(day_number: number) {
  assert(day_number, number());

  const possibleDayNumbers = [1, 2, 3, 4, 5, 6, 7];

  if (!possibleDayNumbers.includes(day_number)) {
    throw new Error("Invalid day number.");
  }

  return day_number;
}

function RecipeNumber(recipe_number: number) {
  assert(recipe_number, number());

  const possibleRecipeNumbers = [1, 2, 3, 4, 5, 6, 7];

  if (!possibleRecipeNumbers.includes(recipe_number)) {
    throw new Error("Invalid recipe number.");
  }

  return recipe_number;
}

type CreateParams = IncludedRecipe & {
  plan_id: string;
};

type ConstructorParams = CreateParams;

export type IncludedRecipe = {
  recipe_id:     string;
  day_number:    number;
  recipe_number: number;
};
