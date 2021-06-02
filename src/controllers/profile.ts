import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { FavoriteRecipe, Recipe, User } from '../access/mysql';

export class ProfileController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
  }

  async view(req: Request, res: Response) {
    const { username } = req.params;

    const user = new User(this.pool);
    const userExists = await user.viewByName(username);
    if (!userExists) return res.send({message: 'User does not exist.'});

    const id = userExists.id;

    const recipe = new Recipe(this.pool);
    const publicRecipes = await recipe.view(id, 1);

    const favoriteRecipe = new FavoriteRecipe(this.pool);
    const favoriteRecipes = await favoriteRecipe.viewByUserId(id);
    
    return res.send({message: 'Success.', publicRecipes, favoriteRecipes});
  }
}