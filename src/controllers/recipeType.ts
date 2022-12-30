import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { RecipeType } from '../access/mysql';

export class RecipeTypeController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view =     this.view.bind(this);
    this.viewById = this.viewById.bind(this);
  }

  async view(req: Request, res: Response) {
    const recipeType = new RecipeType(this.pool);
    const rows = await recipeType.view();
    return res.send(rows);
  }

  async viewById(req: Request, res: Response) {
    const id = Number(req.params.id);
    
    const recipeType = new RecipeType(this.pool);
    const [ row ] = await recipeType.viewById(id);
    return res.send(row);
  }
}