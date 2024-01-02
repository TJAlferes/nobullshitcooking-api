import { RecipeSubrecipe } from './model';
import { RecipeSubrecipeRepoInterface } from './repo';

export class RecipeSubrecipeService {
  repo: RecipeSubrecipeRepoInterface;

  constructor(repo: RecipeSubrecipeRepoInterface) {
    this.repo = repo;
  }

  async bulkCreate({ recipe_id, required_subrecipes }: BulkCreateParams) {
    if (required_subrecipes.length < 1) return true;

    const placeholders = '(?, ?, ?, ?),'
      .repeat(required_subrecipes.length)
      .slice(0, -1);
    const recipe_subrecipes = required_subrecipes.map(rs =>
      RecipeSubrecipe.create({recipe_id, ...rs}).getDTO()
    );
    const result = await this.repo.bulkInsert({placeholders, recipe_subrecipes});
    return result;
  }

  async bulkUpdate({ recipe_id, required_subrecipes }: BulkUpdateParams) {
    if (required_subrecipes.length < 1) {
      const result = await this.repo.deleteByRecipeId(recipe_id);
      return result;
    }

    const placeholders = '(?, ?, ?, ?),'
      .repeat(required_subrecipes.length)
      .slice(0, -1);
    const recipe_subrecipes = required_subrecipes.map(rs =>
      RecipeSubrecipe.create({recipe_id, ...rs}).getDTO()
    );
    const result = await this.repo.bulkUpdate({recipe_id, placeholders, recipe_subrecipes});
    return result;
  }
}

type BulkCreateParams = {
  recipe_id:           string;
  required_subrecipes: RequiredSubrecipe[];
};

type BulkUpdateParams = BulkCreateParams;

type RequiredSubrecipe = {
  amount:       number | null;
  unit_id:      number | null;
  subrecipe_id: string;  // use title instead??? and lookup id here?
};
