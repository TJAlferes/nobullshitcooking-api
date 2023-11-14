import { Request, Response } from 'express';

import { UnitRepo } from './repo';

export const unitController = {
  async viewAll(req: Request, res: Response) {
    const repo = new UnitRepo();
    const units = await repo.viewAll();

    return res.json(units);
  },

  async viewOne(req: Request, res: Response) {
    const unit_id = Number(req.params.unit_id);
    
    const repo = new UnitRepo();
    const unit = await repo.viewOne(unit_id);

    return res.json(unit);
  }
};
