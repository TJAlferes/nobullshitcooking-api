import { RecipeIngredient } from './model';
import { RecipeIngredientRepoInterface } from './repo';

export class RecipeIngredientService {
  repo: RecipeIngredientRepoInterface;

  constructor(repo: RecipeIngredientRepoInterface) {
    this.repo = repo;
  }

  async bulkCreate({ recipe_id, required_ingredients }: BulkCreateParams) {
    if (required_ingredients.length < 1) return true;

    const placeholders = '(?, ?, ?, ?),'
      .repeat(required_ingredients.length)
      .slice(0, -1);
    const recipe_ingredients = required_ingredients.map(ri => 
      RecipeIngredient.create({recipe_id, ...ri}).getDTO()
    );
    const result = await this.repo.bulkInsert({placeholders, recipe_ingredients});
    return result;
  }

  async bulkUpdate({ recipe_id, required_ingredients }: BulkUpdateParams) {
    if (required_ingredients.length < 1) {
      const result = await this.repo.deleteByRecipeId(recipe_id);
      return result;
    }

    const placeholders = '(?, ?, ?, ?),'
      .repeat(required_ingredients.length)
      .slice(0, -1);
    const recipe_ingredients = required_ingredients.map(ri => 
      RecipeIngredient.create({recipe_id, ...ri}).getDTO()
    );
    const result = await this.repo.bulkUpdate({recipe_id, placeholders, recipe_ingredients});
    return result;
  }
}

type BulkCreateParams = {
  recipe_id:            string;
  required_ingredients: RequiredIngredient[];
};

type BulkUpdateParams = BulkCreateParams;

type RequiredIngredient = {
  amount:        number | null;
  unit_id:       number | null;
  ingredient_id: string;
};
