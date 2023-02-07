import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { Ingredient } from '../access/mysql';

export class IngredientController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool =    pool;
    this.viewAll = this.viewAll.bind(this);
    this.viewOne = this.viewOne.bind(this);
  }

  async viewAll(req: Request, res: Response) {
    const authorId = 1;
    const ownerId =  1;

    const ingredient = new Ingredient(this.pool);
    const rows = await ingredient.viewAll(authorId, ownerId);
    return res.send(rows);
  }

  async viewOne(req: Request, res: Response) {
    const id =       Number(req.params.id);
    const authorId = 1;
    const ownerId =  1;

    const ingredient = new Ingredient(this.pool);
    const [ row ] = await ingredient.viewOne(id, authorId, ownerId);
    return res.send(row);
  }
}