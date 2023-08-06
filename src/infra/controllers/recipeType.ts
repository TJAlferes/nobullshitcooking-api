import { Request, Response } from 'express';

import { RecipeTypeRepo } from '../repos/mysql';

export class RecipeTypeController {
  async viewAll(req: Request, res: Response) {
    const repo = new RecipeTypeRepo();
    const rows = await repo.viewAll();
    return res.send(rows);
  }

  async viewOne(req: Request, res: Response) {
    const id = Number(req.params.id);
    
    const repo = new RecipeTypeRepo();
    const [ row ] = await repo.viewOne(id);
    return res.send(row);
  }
}
