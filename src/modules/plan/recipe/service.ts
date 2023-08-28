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
