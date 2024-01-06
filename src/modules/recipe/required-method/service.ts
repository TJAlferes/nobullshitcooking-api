import { RecipeMethod } from './model';
import { RecipeMethodRepoInterface } from './repo';

export class RecipeMethodService {
  repo: RecipeMethodRepoInterface;

  constructor(repo: RecipeMethodRepoInterface) {
    this.repo = repo;
  }

  async bulkCreate({ recipe_id, required_methods }: BulkCreateParams) {
    if (required_methods.length < 1) return;

    const placeholders = '(?, ?),'.repeat(required_methods.length).slice(0, -1);
    const recipe_methods = required_methods.map(({ method_id }) =>
      RecipeMethod.create({
        recipe_id,
        method_id: Number(method_id)
      }).getDTO()
    );
    await this.repo.bulkInsert({placeholders, recipe_methods});
  }

  async bulkUpdate({ recipe_id, required_methods }: BulkUpdateParams) {
    if (required_methods.length < 1) {
      await this.repo.deleteByRecipeId(recipe_id);
      return;
    }

    const placeholders = '(?, ?),'.repeat(required_methods.length).slice(0, -1);
    const recipe_methods = required_methods.map(({ method_id }) =>
      RecipeMethod.create({recipe_id, method_id: Number(method_id)}).getDTO()
    );
    await this.repo.bulkUpdate({recipe_id, placeholders, recipe_methods});
  }
}

type BulkCreateParams = {
  recipe_id:        string;
  required_methods: RequiredMethod[];
};

type BulkUpdateParams = BulkCreateParams;

type RequiredMethod = {
  method_id: number;
};
