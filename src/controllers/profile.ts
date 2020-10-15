import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import { FavoriteRecipe } from '../access/mysql/FavoriteRecipe';
import { Recipe } from '../access/mysql/Recipe';
import { User } from '../access/mysql/User';
import { validProfileRequest } from '../lib/validations/profile/request';

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
    if (!userExists) return res.send({message: 'User does not exist.'});
    const id = userExists.user_id;
    const avatar = userExists.avatar;
    const recipe = new Recipe(this.pool);
    const publicRecipes = await recipe.view(id, 1);
    const favoriteRecipe = new FavoriteRecipe(this.pool);
    const favoriteRecipes = await favoriteRecipe.viewByUserId(id);
    return res
      .send({message: 'Success.', avatar, publicRecipes, favoriteRecipes});
  }
}