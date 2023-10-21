import { Request, Response } from 'express';

import { NOBSC_USER_ID }      from '../../shared/model.js';
import { RecipeRepo }         from '../../recipe/repo.js';
import { FavoriteRecipe }     from './model.js';
import { FavoriteRecipeRepo } from './repo.js';

export const userFavoriteRecipeController = {
  async viewByUserId(req: Request, res: Response) {
    const user_id = req.session.user_id!;
    
    const favoriteRecipeRepo = new FavoriteRecipeRepo();
    const rows = await favoriteRecipeRepo.viewByUserId(user_id);
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
      return res.send({message: 'May not favorite own recipe.'});
    }
    // TO DO: already favorited

    const favoriteRecipe = FavoriteRecipe.create({user_id, recipe_id}).getDTO();

    const { insert } = new FavoriteRecipeRepo();
    await insert(favoriteRecipe);

    return res.send({message: 'Favorited.'});
  },

  async delete(req: Request, res: Response) {
    const { recipe_id } = req.params;
    const user_id = req.session.user_id!;

    const favoriteRecipe = FavoriteRecipe.create({user_id, recipe_id}).getDTO();

    const repo = new FavoriteRecipeRepo();
    await repo.delete(favoriteRecipe);

    return res.send({message: 'Unfavorited.'});
  }
};
