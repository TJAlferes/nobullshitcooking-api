import { Request, Response } from 'express';

import { MeasurementRepo } from '../repos/mysql';

export class MeasurementController {
  async viewAll(req: Request, res: Response) {
    const repo = new MeasurementRepo();
    const rows = await repo.viewAll();
    return res.send(rows);
  }

  async viewOne(req: Request, res: Response) {
    const id = Number(req.params.id);
    
    const repo = new MeasurementRepo();
    const [ row ] = await repo.viewOne(id);
    return res.send(row);
  }
}
