import { Request, Response } from 'express';

import { IngredientTypeRepo } from '../repos/mysql';

export class IngredientTypeController {
  async viewAll(req: Request, res: Response) {
    const repo = new IngredientTypeRepo();
    const rows = await repo.viewAll();
    return res.send(rows);
  }

  async viewOne(req: Request, res: Response) {
    const id = Number(req.params.id);
    
    const repo = new IngredientTypeRepo();
    const [ row ] = await repo.viewOne(id);
    return res.send(row);
  }
}
