import { Request, Response } from 'express';

import { CuisineRepo } from './repo';

export class CuisineController {
  async viewAll(req: Request, res: Response) {
    const repo = new CuisineRepo();
    const rows = await repo.viewAll();

    return res.send(rows);
  }

  async viewOne(req: Request, res: Response) {
    const cuisine_id = Number(req.params.cuisine_id);
    
    const repo = new CuisineRepo();
    const row = await repo.viewOne(cuisine_id);
    
    return res.send(row);
  }
}
