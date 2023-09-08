import { Request, Response } from 'express';
import { assert }            from 'superstruct';

import { RecipeRepo } from '../../../recipe/repo';
//import { SavedRecipe } from './model';
import { SavedRecipeRepo } from './repo';

export const userSavedRecipeController = {
  async viewByUserId(req: Request, res: Response) {
    const user_id = req.session.userInfo!.id;

    const savedRecipeRepo = new SavedRecipeRepo();
    const rows = await savedRecipeRepo.viewByUserId(user_id);

    return res.send(rows);
  },

  async create(req: Request, res: Response) {
    const recipe_id = req.body.recipe_id;
    const user_id   = req.session.userInfo!.id;
    const owner_id  = 1;  // only public recipes may be saved  // TO DO: move to domain??? and change to string char(36)

    assert({user_id, recipe_id}, validSavedRecipe);  // TO DO: move to domain???

    const recipeRepo = new RecipeRepo();
    const recipe = await recipeRepo.viewOneById({recipe_id, user_id, owner_id});
    if (!recipe) {
      return res.send({message: 'Not Found'});
    }
    if (recipe.author_id === user_id) {
      return res.send({message: `
        Your own recipes are saved whenever you create or update them.
        Use this "Save" to bookmark official recipes and public recipes created by other users.
      `});
    }

    const savedRecipeRepo = new SavedRecipeRepo();
    await savedRecipeRepo.insert({user_id, recipe_id});

    return res.send({message: 'Saved.'});
  },

  async delete(req: Request, res: Response) {
    const recipe_id = req.body.recipe_id;
    const user_id =   req.session.userInfo!.id;

    assert({user_id, recipe_id}, validSavedRecipe);  // TO DO: move to domain???
    
    const savedRecipeRepo = new SavedRecipeRepo();
    await savedRecipeRepo.delete({user_id, recipe_id});

    return res.send({message: 'Unsaved.'});
  }
};
