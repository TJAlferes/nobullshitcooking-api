import { Request, Response } from 'express';

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
    const author_id = req.session.user_id!;
    const owner_id  = NOBSC_USER_ID;

    const recipeRepo = new RecipeRepo();
    const recipe = await recipeRepo.viewOneByRecipeId({recipe_id, author_id, owner_id});
    if (!recipe) {
      return res.send({message: 'Not Found'});
    }
    if (recipe.author_id === user_id) {
      return res.send({message: `
        Your own recipes are saved when you create or update them.
        Use this "Save" to bookmark official recipes and public recipes created by other users.
      `});
    }
    // TO DO: already saved

    const savedRecipe = SavedRecipe.create({user_id, recipe_id}).getDTO();

    const { insert } = new SavedRecipeRepo();
    await insert(savedRecipe);

    return res.send({message: 'Saved.'});
  },

  async delete(req: Request, res: Response) {
    const { recipe_id } = req.params;
    const user_id = req.session.user_id!;

    const savedRecipe = SavedRecipe.create({user_id, recipe_id}).getDTO();
    
    const repo = new SavedRecipeRepo();
    await repo.delete(savedRecipe);

    return res.send({message: 'Unsaved.'});
  }
};
