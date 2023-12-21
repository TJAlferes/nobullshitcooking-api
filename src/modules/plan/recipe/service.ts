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
    console.log('included_recipes: ', included_recipes);
    if (included_recipes.length < 1) return;

    const placeholders = '(?, ?, ?, ?),'
      .repeat(included_recipes.length)
      .slice(0, -1);

    const plan_recipes = included_recipes.map(included_recipe =>
      PlanRecipe.create({
        plan_id,
        recipe_id: included_recipe.recipe_id,
        day_number: Number(included_recipe.day_number),
        recipe_number: Number(included_recipe.recipe_number)
      }).getDTO()
    );
    
    this.ensureUniqueDayNumbers(included_recipes);
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
    
    const plan_recipes = included_recipes.map(included_recipe =>
      PlanRecipe.create({plan_id, ...included_recipe}).getDTO()
    );
    
    this.ensureUniqueDayNumbers(included_recipes);
    this.ensureUniqueRecipeNumbers(included_recipes);

    await this.repo.bulkUpdate({plan_id, placeholders, plan_recipes});
  }

  ensureUniqueDayNumbers(included_recipes: IncludedRecipe[]) {
    const dayNumbers = new Set<number>();

    included_recipes.map(({ day_number, recipe_number }) => {
      if (dayNumbers.has(day_number)) {
        throw new ValidationException('Duplicate day_number in plan.');
      } else {
        dayNumbers.add(day_number);
      }
    });
  }

  ensureUniqueRecipeNumbers(included_recipes: IncludedRecipe[]) {
    included_recipes.map(({ day_number, recipe_number }) => {
      const days: number[][] = [];

      days[day_number]
        ? days[day_number].push(recipe_number)
        : days[day_number] = [recipe_number];

      for (const day of days) {
        const recipeNumbers = new Set<number>();

        day.map(recipe_number => {
          if (recipeNumbers.has(recipe_number)) {
            throw new ValidationException('Duplicate recipe_number in plan.');
          } else {
            recipeNumbers.add(recipe_number);
          }
        });
      }
    });
  }
}

type BulkCreateParams = {
  plan_id:          string;
  included_recipes: IncludedRecipe[];
};

type BulkUpdateParams = BulkCreateParams;
