import { Request, Response } from 'express';

import { RecipeRepo } from '../../recipe/repo';
import { NOBSC_USER_ID } from '../../shared/model';
import { FavoriteRecipeRepo } from '../favorite-recipe/repo';
import { UserImageRepo } from '../image/repo';
import { UserRepo } from '../repo';
import { NotFoundException } from '../../../utils/exceptions';

export const profileController = {
  async view(req: Request, res: Response) {
    const { username } = req.params;

    const userRepo = new UserRepo();
    const userExists = await userRepo.getByUsername(username);
    if (!userExists) throw new NotFoundException();

    const { user_id } = userExists;

    const userImageRepo = new UserImageRepo();
    const avatar = await userImageRepo.viewCurrent(user_id);

    const recipeRepo = new RecipeRepo();
    const public_recipes = await recipeRepo.overviewAll({
      author_id: user_id,
      owner_id:  NOBSC_USER_ID
    });

    const favoriteRecipeRepo = new FavoriteRecipeRepo();
    const favorite_recipes = await favoriteRecipeRepo.viewByUserId(user_id);
    
    return res.status(200).json({
      user_id,
      avatar: avatar ? avatar.image_filename : 'default',
      public_recipes,
      favorite_recipes
    });
  }
};
