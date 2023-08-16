import { Request, Response } from 'express';

import { UnitRepo } from '../repos/mysql';

export class UnitController {
  async viewAll(req: Request, res: Response) {
    const repo = new UnitRepo();
    const rows = await repo.viewAll();
    return res.send(rows);
  }

  async viewOne(req: Request, res: Response) {
    const id = Number(req.params.id);
    
    const repo = new UnitRepo();
    const row = await repo.viewOne(id);
    return res.send(row);
  }
}
