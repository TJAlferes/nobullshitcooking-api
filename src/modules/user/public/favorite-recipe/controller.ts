import { Request, Response } from 'express';
import { assert }            from 'superstruct';

import { FavoriteRecipeRepo, RecipeRepo } from './repo';
import { validFavoriteRecipe }            from '../../lib/validations';

export const userFavoriteRecipeController = {
  async viewByUserId(req: Request, res: Response) {
    const user_id = req.session.userInfo!.id;
    
    const favoriteRecipeRepo = new FavoriteRecipeRepo();
    const rows = await favoriteRecipeRepo.viewByUserId(user_id);
    return res.send(rows);
  },

  async create(req: Request, res: Response) {
    const recipe_id = req.body.recipe_id;
    const user_id   = req.session.userInfo!.id;
    const owner_id   = 1;  // only public recipes may be favorited  // TO DO: move to domain??? and change to string char(36)

    assert({user_id, recipe_id}, validFavoriteRecipe);  // TO DO: move to domain???

    const recipeRepo = new RecipeRepo();
    const recipe = await recipeRepo.viewOneById({recipe_id, user_id, owner_id});
    if (!recipe) {
      return res.send({message: 'Not Found'});
    }
    if (recipe.author_id === user_id) {
      return res.send({message: 'May not favorite own recipe.'});
    }

    const favoriteRecipeRepo = new FavoriteRecipeRepo();
    await favoriteRecipeRepo.insert({user_id, recipe_id});
    return res.send({message: 'Favorited.'});
  },

  async delete(req: Request, res: Response) {
    const recipe_id = req.body.recipe_id;
    const user_id   = req.session.userInfo!.id;

    assert({user_id, recipe_id}, validFavoriteRecipe);  // TO DO: move to domain???

    const favoriteRecipeRepo = new FavoriteRecipeRepo();
    await favoriteRecipeRepo.delete({user_id, recipe_id});
    return res.send({message: 'Unfavorited.'});
  }
};
