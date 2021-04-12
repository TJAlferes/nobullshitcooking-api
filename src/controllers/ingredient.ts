import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { Ingredient } from '../access/mysql';

export class IngredientController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
    this.viewById = this.viewById.bind(this);
  }

  async view(req: Request, res: Response) {
    const author = "NOBSC";
    const owner = "NOBSC";

    const ingredient = new Ingredient(this.pool);

    const rows = await ingredient.view(author, owner);

    return res.send(rows);
  }

  async viewById(req: Request, res: Response) {
    const { id } = req.params;
    const author = "NOBSC";
    const owner = "NOBSC";

    const ingredient = new Ingredient(this.pool);

    const [ row ] = await ingredient.viewById(id, author, owner);
    
    return res.send(row);
  }
}