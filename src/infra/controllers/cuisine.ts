import { Request, Response } from 'express';

import { CuisineRepo } from '../repos/mysql';

export class CuisineController {
  async viewAll(req: Request, res: Response) {
    const repo = new CuisineRepo();
    const rows = await repo.viewAll();
    return res.send(rows);
  }

  async viewOne(req: Request, res: Response) {
    const id = Number(req.params.id);
    
    const repo = new CuisineRepo();
    const [ row ] = await repo.viewOne(id);
    return res.send(row);
  }
}
