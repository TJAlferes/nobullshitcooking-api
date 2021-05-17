import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import { FavoriteRecipe } from '../../access/mysql';
import { validFavoriteRecipe } from '../../lib/validations/entities';

export class UserFavoriteRecipeController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewByUserId = this.viewByUserId.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
  }

  async viewByUserId(req: Request, res: Response) {
    const userId = req.session!.userInfo.id;
    const favoriteRecipe = new FavoriteRecipe(this.pool);
    const rows = await favoriteRecipe.viewByUserId(userId);
    return res.send(rows);
  }

  async create(req: Request, res: Response) {
    const recipeId = Number(req.body.id);
    const userId = req.session!.userInfo.id;
    assert({userId, recipeId}, validFavoriteRecipe);
    const favoriteRecipe = new FavoriteRecipe(this.pool);
    await favoriteRecipe.create(userId, recipeId);
    return res.send({message: 'Favorited.'});
  }

  async delete(req: Request, res: Response) {
    const recipeId = Number(req.body.id);
    const userId = req.session!.userInfo.id;
    assert({userId, recipeId}, validFavoriteRecipe);
    const favoriteRecipe = new FavoriteRecipe(this.pool);
    await favoriteRecipe.delete(userId, recipeId);
    return res.send({message: 'Unfavorited.'});
  }
}