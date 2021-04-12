import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { IngredientType } from '../access/mysql';

export class IngredientTypeController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
    this.viewByName = this.viewByName.bind(this);
  }

  async view(req: Request, res: Response) {
    const ingredientType = new IngredientType(this.pool);

    const rows = await ingredientType.view();

    return res.send(rows);
  }

  async viewByName(req: Request, res: Response) {
    const { name } = req.params;

    const ingredientType = new IngredientType(this.pool);

    const [ row ] = await ingredientType.viewByName(name);
    
    return res.send(row);
  }
}