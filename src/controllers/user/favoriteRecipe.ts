import { Request, Response } from 'express';

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

    res.send(rows);
  },
  createMyFavoriteRecipe: async function(req: Request, res: Response) {
    const userId = req.session!.userInfo.userId;
    const recipeId = Number(req.body.recipeId);

    validFavoriteRecipeEntity({userId, recipeId});

    const favoriteRecipe = new FavoriteRecipe(pool);

    await favoriteRecipe.createMyFavoriteRecipe(userId, recipeId);

    res.send({message: 'Favorited.'});
  },
  deleteMyFavoriteRecipe: async function(req: Request, res: Response) {
    const userId = req.session!.userInfo.userId;
    const recipeId = Number(req.body.recipeId);

    validFavoriteRecipeEntity({userId, recipeId});

    const favoriteRecipe = new FavoriteRecipe(pool);

    await favoriteRecipe.deleteMyFavoriteRecipe(userId, recipeId);
    
    res.send({message: 'Unfavorited.'});
  }
};