import { ValidationException } from '../../../utils/exceptions';
import { PlanRecipe } from './model';
import type { IncludedRecipe } from './model';
import { PlanRecipeRepoInterface } from './repo';

export class PlanRecipeService {
  repo: PlanRecipeRepoInterface;

  constructor(repo: PlanRecipeRepoInterface) {
    this.repo = repo;
  }

  async bulkCreate({ plan_id, included_recipes }: BulkCreateParams) {
    if (included_recipes.length < 1) return;

    const placeholders = '(?, ?, ?, ?), '
      .repeat(included_recipes.length)
      .slice(0, -2);

    const plan_recipes = included_recipes.map(({
      recipe_id,
      day_number,
      recipe_number
    }) =>
      PlanRecipe.create({
        plan_id,
        recipe_id,
        day_number: Number(day_number),
        recipe_number: Number(recipe_number)
      }).getDTO()
    );
    
    this.ensureUniqueRecipeNumbers(included_recipes);

    await this.repo.bulkInsert({placeholders, plan_recipes});
  }

  async bulkUpdate({ plan_id, included_recipes }: BulkUpdateParams) {
    if (included_recipes.length < 1) {
      await this.repo.deleteByPlanId(plan_id);
      return;
    }

    const placeholders = '(?, ?, ?, ?),'
      .repeat(included_recipes.length)
      .slice(0, -1);
    
    const plan_recipes = included_recipes.map(({
      recipe_id,
      day_number,
      recipe_number
    }) =>
      PlanRecipe.create({
        plan_id,
        recipe_id,
        day_number: Number(day_number),
        recipe_number: Number(recipe_number)
      }).getDTO()
    );

    this.ensureUniqueRecipeNumbers(included_recipes);

    await this.repo.bulkUpdate({plan_id, placeholders, plan_recipes});
  }

  ensureUniqueRecipeNumbers(included_recipes: IncludedRecipe[]) {
    const days: number[][] = [[], [], [], [], [], [], []];

    included_recipes.map(({ day_number, recipe_number }) => {
      days[day_number - 1].push(recipe_number);
    });

    for (const day of days) {
      if (day.length < 2) continue;

      const recipeNumbers = new Set<number>();

      day.map(recipe_number => {
        if (recipeNumbers.has(recipe_number)) {
          throw new ValidationException('Duplicate recipe_number in plan.');
        } else {
          recipeNumbers.add(recipe_number);
        }
      });
    }
  }
}

type BulkCreateParams = {
  plan_id:          string;
  included_recipes: IncludedRecipe[];
};

type BulkUpdateParams = BulkCreateParams;
