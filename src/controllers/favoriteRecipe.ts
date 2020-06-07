import { Request, Response } from 'express';

//import { pool } from '../lib/connections/mysqlPoolConnection';
//import { FavoriteRecipe } from '../mysql-access/FavoriteRecipe';

export const favoriteRecipeController = {
  viewMostFavorited: async function(req: Request, res: Response) {
    //const limit = req.body.limit;  // no. change.

    //const favoriteRecipe = new FavoriteRecipe(pool);

    //const rows = await favoriteRecipe.viewMostFavorited(limit);
    
    //res.send(rows);
    res.send("finish");
  }
};