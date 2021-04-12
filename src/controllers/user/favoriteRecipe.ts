import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import { FavoriteRecipe } from '../../access/mysql';
import {
  validFavoriteRecipeEntity
} from '../../lib/validations/favoriteRecipe/entity';

export class UserFavoriteRecipeController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewByUser = this.viewByUser.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
  }

  async viewByUser(req: Request, res: Response) {
    const user = req.session!.userInfo.username;

    const favoriteRecipe = new FavoriteRecipe(this.pool);

    const rows = await favoriteRecipe.viewByUser(user);
    
    return res.send(rows);
  }

  async create(req: Request, res: Response) {
    const recipe = req.body.id;
    const user = req.session!.userInfo.username;

    assert({user, recipe}, validFavoriteRecipeEntity);

    const favoriteRecipe = new FavoriteRecipe(this.pool);

    await favoriteRecipe.create(user, recipe);

    return res.send({message: 'Favorited.'});
  }

  async delete(req: Request, res: Response) {
    const recipe = req.body.id;
    const user = req.session!.userInfo.username;

    assert({user, recipe}, validFavoriteRecipeEntity);

    const favoriteRecipe = new FavoriteRecipe(this.pool);

    await favoriteRecipe.delete(user, recipe);

    return res.send({message: 'Unfavorited.'});
  }
}