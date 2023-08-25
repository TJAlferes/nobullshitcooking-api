import { Request, Response } from 'express';

import { FavoriteRecipeRepo } from '../public/favorite-recipe/repo';
import { RecipeRepo } from '../public/recipe/repo';  // TO DO: implement??? or just a service???
import { UserRepo } from '../repo';

export const profileController = {
  async view(req: Request, res: Response) {
    const { username } = req.params;

    const userRepo = new UserRepo();
    const userExists = await userRepo.getByUsername(username);
    if (!userExists) return res.send({message: 'User does not exist.'});

    const { user_id } = userExists;

    const recipeRepo = new RecipeRepo();
    const publicRecipes = await recipeRepo.viewAll(user_id, 1);

    const favoriteRecipeRepo = new FavoriteRecipeRepo();
    const favoriteRecipes = await favoriteRecipeRepo.viewByUserId(user_id);
    
    return res.send({
      message: 'Success.',
      publicRecipes,
      favoriteRecipes
    });
  }
};
