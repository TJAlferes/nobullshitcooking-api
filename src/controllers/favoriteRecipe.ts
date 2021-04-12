import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

//import { FavoriteRecipe } from '../access/mysql';

export class FavoriteRecipeController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewMostFavorited = this.viewMostFavorited.bind(this);
  }

  async viewMostFavorited(req: Request, res: Response) {
    //const limit = req.body.limit;  // no. change.
    //const favoriteRecipe = new FavoriteRecipe(pool);
    //const rows = await favoriteRecipe.viewMostFavorited(limit);
    //res.send(rows);
    res.send("finish");
  }
}