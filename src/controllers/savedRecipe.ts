import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

//import { SavedRecipe } from '../access/mysql/SavedRecipe';

export class SavedRecipeController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewMostSaved = this.viewMostSaved.bind(this);
  }

  async viewMostSaved(req: Request, res: Response) {
    //const limit = req.body.limit; // no. change.
    //const savedRecipe = new SavedRecipe(pool);
    //const rows = await savedRecipe.viewMostSaved(limit);
    //res.send(rows);
    res.send("finish");
  }
}