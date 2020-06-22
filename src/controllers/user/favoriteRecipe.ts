import { Request, Response } from 'express';
import { assert } from 'superstruct';

import { pool } from '../../lib/connections/mysqlPoolConnection';
import {
  validFavoriteRecipeEntity
} from '../../lib/validations/favoriteRecipe/favoriteRecipeEntity';
import { FavoriteRecipe } from '../../mysql-access/FavoriteRecipe';

export const userFavoriteRecipeController = {
  viewMyFavoriteRecipes: async function(req: Request, res: Response) {
    const userId = req.session!.userInfo.userId;

    const favoriteRecipe = new FavoriteRecipe(pool);

    const rows = await favoriteRecipe.viewMyFavoriteRecipes(userId);

    return res.send(rows);
  },
  createMyFavoriteRecipe: async function(req: Request, res: Response) {
    const userId = req.session!.userInfo.userId;
    const recipeId = Number(req.body.recipeId);

    assert({userId, recipeId}, validFavoriteRecipeEntity);

    const favoriteRecipe = new FavoriteRecipe(pool);

    await favoriteRecipe.createMyFavoriteRecipe(userId, recipeId);

    return res.send({message: 'Favorited.'});
  },
  deleteMyFavoriteRecipe: async function(req: Request, res: Response) {
    const userId = req.session!.userInfo.userId;
    const recipeId = Number(req.body.recipeId);

    assert({userId, recipeId}, validFavoriteRecipeEntity);

    const favoriteRecipe = new FavoriteRecipe(pool);

    await favoriteRecipe.deleteMyFavoriteRecipe(userId, recipeId);
    
    return res.send({message: 'Unfavorited.'});
  }
};