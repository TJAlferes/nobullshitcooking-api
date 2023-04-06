import { Request, Response } from 'express';
import { Pool }              from 'mysql2/promise';

import { FavoriteRecipeRepository, RecipeRepository, UserRepository } from '../access/mysql';

export class ProfileController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async view(req: Request, res: Response) {
    const { username } = req.params;

    const userRepo = new UserRepository(this.pool);
    const userExists = await userRepo.viewByName(username);
    if (!userExists) return res.send({message: 'User does not exist.'});

    const id = userExists.id;

    const recipeRepo = new RecipeRepository(this.pool);
    const publicRecipes = await recipeRepo.viewAll(id, 1);

    const favoriteRecipeRepo = new FavoriteRecipeRepository(this.pool);
    const favoriteRecipes = await favoriteRecipeRepo.viewByUserId(id);
    
    return res.send({message: 'Success.', publicRecipes, favoriteRecipes});
  }
}
