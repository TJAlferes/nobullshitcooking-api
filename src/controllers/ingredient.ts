import { Request, Response } from 'express';

import { pool } from '../lib/connections/mysqlPoolConnection';
import { Ingredient } from '../mysql-access/Ingredient';

export const ingredientController = {
  view: async function (req: Request, res: Response) {
    const authorId = 1;
    const ownerId = 1;

    const ingredient = new Ingredient(pool);

    const rows = await ingredient.view(authorId, ownerId);

    return res.send(rows);
  },
  viewById: async function(req: Request, res: Response) {
    const id = Number(req.params.id);
    const authorId = 1;
    const ownerId = 1;

    const ingredient = new Ingredient(pool);

    const [ row ] = await ingredient.viewById(id, authorId, ownerId);

    return res.send(row);
  }
};