import { Request, Response } from 'express';
import { assert }            from 'superstruct';

import { FavoriteRecipeRepo, RecipeRepo } from '../../repos/mysql';
import { validFavoriteRecipe }            from '../../lib/validations';

export class UserFavoriteRecipeController {
  async viewByUserId(req: Request, res: Response) {
    const userId = req.session.userInfo!.id;
    
    const favoriteRecipeRepo = new FavoriteRecipeRepo();
    const rows = await favoriteRecipeRepo.viewByUserId(userId);
    return res.send(rows);
  }

  async create(req: Request, res: Response) {
    const recipeId = Number(req.body.id);
    const userId =   req.session.userInfo!.id;
    const ownerId =  1;  // only public recipes may be favorited

    assert({userId, recipeId}, validFavoriteRecipe);

    const recipeRepo = new RecipeRepo();
    const recipe = await recipeRepo.viewOneById(recipeId, userId, ownerId);
    if (!recipe) return res.send({message: 'Not Found'});
    if (recipe.author_id === userId) return res.send({message: 'May not favorite own recipe.'});

    const favoriteRecipeRepo = new FavoriteRecipeRepo();
    await favoriteRecipeRepo.create(userId, recipeId);
    return res.send({message: 'Favorited.'});
  }

  async delete(req: Request, res: Response) {
    const recipeId = Number(req.body.id);
    const userId =   req.session.userInfo!.id;

    assert({userId, recipeId}, validFavoriteRecipe);

    const favoriteRecipeRepo = new FavoriteRecipeRepo();
    await favoriteRecipeRepo.delete(userId, recipeId);
    return res.send({message: 'Unfavorited.'});
  }
}
