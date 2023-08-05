import { Request, Response } from 'express';

import { EquipmentTypeRepo } from '../access/mysql';

export class EquipmentTypeController {
  async viewAll(req: Request, res: Response) {
    const repo = new EquipmentTypeRepo();
    const rows = await repo.viewAll();
    return res.send(rows);
  }

  async viewOne(req: Request, res: Response) {
    const id = Number(req.params.id);
    
    const repo = new EquipmentTypeRepo();
    const [ row ] = await repo.viewOne(id);
    return res.send(row);
  }
}
