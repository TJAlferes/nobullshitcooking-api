import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import { validRecipeTypeRequest } from '../lib/validations/recipeType/request';
import { RecipeType } from '../access/mysql';

export class RecipeTypeController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
    this.viewByName = this.viewByName.bind(this);
  }

  async view(req: Request, res: Response) {
    const recipeType = new RecipeType(this.pool);

    const rows = await recipeType.view();

    return res.send(rows);
  }

  async viewByName(req: Request, res: Response) {
    const { name } = req.params;

    //assert({id}, validRecipeTypeRequest);

    const recipeType = new RecipeType(this.pool);

    const [ row ] = await recipeType.viewByName(name);
    
    return res.send(row);
  }
}