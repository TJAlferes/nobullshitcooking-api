import { ForbiddenException } from '../../../utils/exceptions';
import type { IncludedRecipe } from '../../plan/recipe/model';

export interface RecipeRepoInterface {
  hasPrivate: (recipe_ids: string[]) => Promise<boolean>;
}

export class PublicPlanService {
  recipeRepo: RecipeRepoInterface;

  constructor(recipeRepo: RecipeRepoInterface) {
    this.recipeRepo = recipeRepo;
  }
  
  async checkForPrivateContent(included_recipes: IncludedRecipe[]) {
    // Examine each included recipe.
    // If any are private, abort the creation of this plan,
    // as public user plans may NOT contain private recipes.
    // check each recipe_id, check if it is private, throw new Error
    if (included_recipes.length > 0) {
      const recipe_ids = included_recipes.map(recipe => recipe.recipe_id);
      const hasPrivate = await this.recipeRepo.hasPrivate(recipe_ids);
      if (hasPrivate) {
        throw ForbiddenException('Public content may not contain private content.');
      }
    }
  }
}
