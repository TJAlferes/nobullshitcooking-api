import { Request, Response } from 'express';
import { Pool }              from 'mysql2/promise';

import { RecipeTypeRepository } from '../access/mysql';

export class RecipeTypeController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async viewAll(req: Request, res: Response) {
    const repo = new RecipeTypeRepository(this.pool);
    const rows = await repo.viewAll();
    return res.send(rows);
  }

  async viewOne(req: Request, res: Response) {
    const id = Number(req.params.id);
    
    const repo = new RecipeTypeRepository(this.pool);
    const [ row ] = await repo.viewOne(id);
    return res.send(row);
  }
}
