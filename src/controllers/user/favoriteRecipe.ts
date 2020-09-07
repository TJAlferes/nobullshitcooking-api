import { Request, Response } from 'express';
import { assert } from 'superstruct';

import { pool } from '../../lib/connections/mysqlPoolConnection';
import {
  validFavoriteRecipeEntity
} from '../../lib/validations/favoriteRecipe/entity';
import { FavoriteRecipe } from '../../mysql-access/FavoriteRecipe';

export const userFavoriteRecipeController = {
  viewByUserId: async function(req: Request, res: Response) {
    const userId = req.session!.userInfo.id;

    const favoriteRecipe = new FavoriteRecipe(pool);

    const rows = await favoriteRecipe.viewByUserId(userId);

    return res.send(rows);
  },
  create: async function(req: Request, res: Response) {
    const recipeId = Number(req.body.id);
    const userId = req.session!.userInfo.id;

    assert({userId, recipeId}, validFavoriteRecipeEntity);

    const favoriteRecipe = new FavoriteRecipe(pool);

    await favoriteRecipe.create(userId, recipeId);

    return res.send({message: 'Favorited.'});
  },
  delete: async function(req: Request, res: Response) {
    const recipeId = Number(req.body.id);
    const userId = req.session!.userInfo.id;

    assert({userId, recipeId}, validFavoriteRecipeEntity);

    const favoriteRecipe = new FavoriteRecipe(pool);

    await favoriteRecipe.delete(userId, recipeId);
    
    return res.send({message: 'Unfavorited.'});
  }
};