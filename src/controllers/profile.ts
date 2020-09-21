import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import { validProfileRequest } from '../lib/validations/profile/request';
import { FavoriteRecipe } from '../mysql-access/FavoriteRecipe';
import { Recipe } from '../mysql-access/Recipe';
import { User } from '../mysql-access/User';

export class ProfileController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
  }

  async view(req: Request, res: Response) {
    const username = req.params.username;
    assert({username}, validProfileRequest);
    const user = new User(this.pool);
    const [ userExists ] = await user.viewByName(username);
    if (!userExists.length) return res.send({message: 'User does not exist.'});
    const id = userExists[0].user_id;
    const avatar = userExists[0].avatar;
    const recipe = new Recipe(this.pool);
    const publicRecipes = await recipe.view(id, 1);
    const favoriteRecipe = new FavoriteRecipe(this.pool);
    const favoriteRecipes = await favoriteRecipe.viewByUserId(id);
    return res
      .send({message: 'Success.', avatar, publicRecipes, favoriteRecipes});
  }
}