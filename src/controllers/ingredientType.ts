import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { IngredientType } from '../access/mysql';

export class IngredientTypeController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
    this.viewById = this.viewById.bind(this);
  }

  async view(req: Request, res: Response) {
    const ingredientType = new IngredientType(this.pool);
    const rows = await ingredientType.view();
    return res.send(rows);
  }

  async viewById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const ingredientType = new IngredientType(this.pool);
    const [ row ] = await ingredientType.viewById(id);
    return res.send(row);
  }
}