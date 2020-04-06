import { Request, Response } from 'express';

const pool = require('../lib/connections/mysqlPoolConnection');
const FavoriteRecipe = require('../mysql-access/FavoriteRecipe');

const favoriteRecipeController = {
  viewMostFavorited: async function(req: Request, res: Response) {
    const limit = req.body.limit;  // no. change.
    const favoriteRecipe = new FavoriteRecipe(pool);
    const rows = await favoriteRecipe.viewMostFavorited(limit);
    res.send(rows);
  }
};

module.exports = favoriteRecipeController;