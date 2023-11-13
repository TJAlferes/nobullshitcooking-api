import { Request, Response } from 'express';

import { ForbiddenException, NotFoundException} from '../../../utils/exceptions';
import { NOBSC_USER_ID }   from '../../shared/model';
import { RecipeRepo }      from '../../recipe/repo';
import { SavedRecipe }     from './model';
import { SavedRecipeRepo } from './repo';

export const userSavedRecipeController = {
  async viewByUserId(req: Request, res: Response) {
    const user_id = req.session.user_id!;

    const savedRecipeRepo = new SavedRecipeRepo();
    const rows = await savedRecipeRepo.viewByUserId(user_id);

    return res.send(rows);
  },

  async create(req: Request, res: Response) {
    const { recipe_id } = req.params;
    const user_id   = req.session.user_id!;

    const recipeRepo = new RecipeRepo();
    const recipe = await recipeRepo.viewOneByRecipeId(recipe_id);
    if (!recipe) throw NotFoundException();
    if (recipe.author_id === user_id) {
      throw ForbiddenException(`
        Your own recipes are saved when you create or update them.
        Use this "Save" to bookmark official recipes and public user recipes.
      `);
    }
    if (recipe.owner_id !== NOBSC_USER_ID) {
      throw ForbiddenException("May only save public recipes.");
    }

    const savedRecipe = SavedRecipe.create({user_id, recipe_id}).getDTO();

    const savedRecipeRepo = new SavedRecipeRepo();
    await savedRecipeRepo.insert(savedRecipe);

    return res.status(201);
  },

  async delete(req: Request, res: Response) {
    const { recipe_id } = req.params;
    const user_id = req.session.user_id!;

    const savedRecipe = SavedRecipe.create({user_id, recipe_id}).getDTO();
    
    const repo = new SavedRecipeRepo();
    await repo.delete(savedRecipe);

    return res.status(204);
  }
};
