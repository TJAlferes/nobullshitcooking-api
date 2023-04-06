import { Request, Response } from 'express';
import { Pool }              from 'mysql2/promise';

import { RecipeType } from '../access/mysql';

export class RecipeTypeController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async viewAll(req: Request, res: Response) {
    const recipeType = new RecipeType(this.pool);
    const rows = await recipeType.viewAll();
    return res.send(rows);
  }

  async viewOne(req: Request, res: Response) {
    const id = Number(req.params.id);
    
    const recipeType = new RecipeType(this.pool);
    const [ row ] = await recipeType.viewOne(id);
    return res.send(row);
  }
}
