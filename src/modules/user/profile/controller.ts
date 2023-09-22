import { Request, Response } from 'express';

import { RecipeRepo }         from '../../recipe/repo';
import { NOBSC_USER_ID }      from '../../shared/model';
import { FavoriteRecipeRepo } from '../favorite-recipe/repo';
import { UserRepo }           from '../repo';

export const profileController = {
  async view(req: Request, res: Response) {
    const { username } = req.params;

    const { getByUsername } = new UserRepo();
    const userExists = await getByUsername(username);
    if (!userExists) {
      return res.send({message: 'User not found.'});
    }

    const { user_id } = userExists;

    const { overviewAll } = new RecipeRepo();
    const publicRecipes = await overviewAll({
      author_id: user_id,
      owner_id:  NOBSC_USER_ID
    });

    const { viewByUserId } = new FavoriteRecipeRepo();
    const favoriteRecipes = await viewByUserId(user_id);
    
    return res.send({
      message: 'Success.',
      publicRecipes,
      favoriteRecipes
    });
  }
};
