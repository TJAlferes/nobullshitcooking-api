import { Request, Response } from 'express';

import { UnitRepo } from './repo.js';

export const unitController = {
  async viewAll(req: Request, res: Response) {
    const repo = new UnitRepo();
    const rows = await repo.viewAll();

    return res.json(rows);
  },

  async viewOne(req: Request, res: Response) {
    const unit_id = Number(req.params.unit_id);
    
    const repo = new UnitRepo();
    const row = await repo.viewOne(unit_id);

    return res.json(row);
  }
};
