import { Request, Response } from 'express';

import { FavoriteRecipeRepo, RecipeRepo, UserRepo } from '../access/mysql';

export class ProfileController {
  async view(req: Request, res: Response) {
    const { username } = req.params;

    const userRepo = new UserRepo();
    const userExists = await userRepo.viewByName(username);
    if (!userExists) return res.send({message: 'User does not exist.'});

    const id = userExists.id;

    const recipeRepo = new RecipeRepo();
    const publicRecipes = await recipeRepo.viewAll(id, 1);

    const favoriteRecipeRepo = new FavoriteRecipeRepo();
    const favoriteRecipes = await favoriteRecipeRepo.viewByUserId(id);
    
    return res.send({message: 'Success.', publicRecipes, favoriteRecipes});
  }
}
