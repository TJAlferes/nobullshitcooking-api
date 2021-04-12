import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import { FavoriteRecipe, Recipe, User } from '../access/mysql';
import { validProfileRequest } from '../lib/validations/profile/request';

export class ProfileController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
  }

  async view(req: Request, res: Response) {
    const { username } = req.params;

    assert({username}, validProfileRequest);

    const user = new User(this.pool);

    const [ userExists ] = await user.viewByName(username);

    if (!userExists) return res.send({message: 'User does not exist.'});

    const avatar = userExists.avatar;
    const owner = "NOBSC";

    const recipe = new Recipe(this.pool);

    const publicRecipes = await recipe.view(username, owner);

    const favoriteRecipe = new FavoriteRecipe(this.pool);

    const favoriteRecipes = await favoriteRecipe.viewByUser(username);
    
    return res
      .send({message: 'Success.', avatar, publicRecipes, favoriteRecipes});
  }
}