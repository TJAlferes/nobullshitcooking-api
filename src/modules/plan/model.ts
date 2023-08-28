import { assert, string } from 'superstruct';

import { GenerateUUIDv7StringId, UUIDv7StringId } from '../shared/model';

export class Plan {
  private plan_id;
  private author_id;
  private owner_id;
  private plan_name;

  private constructor(params: ConstructorParams) {
    this.plan_id   = UUIDv7StringId(params.plan_id);
    this.author_id = UUIDv7StringId(params.author_id);
    this.owner_id  = UUIDv7StringId(params.owner_id);
    this.plan_name = PlanName(params.plan_name);
  }

  static create(params: CreateParams) {
    const plan_id = GenerateUUIDv7StringId();
    const plan = new Plan({...params, plan_id});
    // persist HERE? using a repo interface?
    return plan;
  }

  getDTO() {
    return {
      plan_id:   this.plan_id,
      author_id: this.author_id,
      owner_id:  this.owner_id,
      plan_name: this.plan_name
    };
  }
}

export function PlanName(name: string) {
  assert(name, string());
  if (name.length > 50) {
    throw new Error("Plan name must be no more than 50 characters");
  }
  return name;
}

type CreateParams = {
  author_id: string;
  owner_id:  string;
  plan_name: string;
  plan_data: string;
};

type UpdateParams = CreateParams & {
  plan_id: string;
}

type ConstructorParams = UpdateParams;

/*type PlanDay = {
  plan_id:    string;
  day_id:     string;
  day_number: number;
};

type PlanDayRecipe = {
  day_id:        string;
  recipe_id:     string;
  recipe_number: number;
};*/
