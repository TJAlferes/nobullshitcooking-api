import { PlanRecipe }              from "./model";
import { PlanRecipeRepoInterface } from "./repo";

export class PlanRecipeService {
  repo: PlanRecipeRepoInterface;

  constructor(repo: PlanRecipeRepoInterface) {
    this.repo = repo;
  }

  async create({ plan_id, plan_recipes }: CreateParams) {
    if (!plan_recipes.length) return;

    const placeholders = '(?, ?, ?),'.repeat(plan_recipes.length).slice(0, -1);

    const values= plan_recipes.map(plan_recipe =>
      PlanRecipe.create(plan_recipe).getDTO()
    );

    // TO DO: also test for existence and uniqueness of recipe_number and day_number
    // list
    // for each number, check if that number is in the list
    // if it is NOT in the list, throw
    // else pull that number from the list
    // finally, if list has any numbers remaining (not pulled), throw

    await this.repo.insert({placeholders, values});
  }
}

type CreateParams = {
  plan_id:      string;
  plan_recipes: PlanRecipeRow[];
};

type PlanRecipeRow = {
  plan_id:       string;
  recipe_id:     string;
  day_number:    number;
  recipe_number: number;
};
