import { Request, Response } from 'express';

import { IngredientRepo } from '../access/mysql';

export class IngredientController {
  async viewAll(req: Request, res: Response) {
    const authorId = 1;
    const ownerId =  1;

    const repo = new IngredientRepo();
    const rows = await repo.viewAll(authorId, ownerId);
    return res.send(rows);
  }

  async viewOne(req: Request, res: Response) {
    const id =       Number(req.params.id);
    const authorId = 1;
    const ownerId =  1;

    const repo = new IngredientRepo();
    const [ row ] = await repo.viewOne(id, authorId, ownerId);
    return res.send(row);
  }
}
