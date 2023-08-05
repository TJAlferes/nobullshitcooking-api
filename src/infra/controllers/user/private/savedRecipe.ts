import { Request, Response } from 'express';
import { assert }            from 'superstruct';

import { SavedRecipeRepo, RecipeRepo } from '../../../access/mysql';
import { validSavedRecipe }            from '../../../lib/validations';

export class UserSavedRecipeController {
  async viewByUserId(req: Request, res: Response) {
    const userId = req.session.userInfo!.id;

    const savedRecipeRepo = new SavedRecipeRepo();
    const rows = await savedRecipeRepo.viewByUserId(userId);
    return res.send(rows);
  }

  async create(req: Request, res: Response) {
    const recipeId = Number(req.body.id);
    const userId =   req.session.userInfo!.id;
    const ownerId =  1;  // only public recipes may be saved

    assert({userId, recipeId}, validSavedRecipe);

    const recipeRepo = new RecipeRepo();
    const recipe = await recipeRepo.viewOneById(recipeId, userId, ownerId);
    if (!recipe)
      return res.send({message: 'Not Found'});
    if (recipe.author_id === userId)
      return res.send({message: 'Your recipes are saved when you create or update them. This "Save" is so you may save public recipes created by others.'});

    const savedRecipeRepo = new SavedRecipeRepo();
    await savedRecipeRepo.create(userId, recipeId);
    return res.send({message: 'Saved.'});
  }

  async delete(req: Request, res: Response) {
    const recipeId = Number(req.body.id);
    const userId =   req.session.userInfo!.id;

    assert({userId, recipeId}, validSavedRecipe);
    
    const savedRecipeRepo = new SavedRecipeRepo();
    await savedRecipeRepo.delete(userId, recipeId);
    return res.send({message: 'Unsaved.'});
  }
}
