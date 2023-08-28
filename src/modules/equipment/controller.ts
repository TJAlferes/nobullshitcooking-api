import { Request, Response } from 'express';

import { NOBSC_USER_ID } from '../shared/model';
import { EquipmentRepo } from './repo';

export const equipmentController = {
  async viewAll(req: Request, res: Response) {
    const owner_id = NOBSC_USER_ID;

    const repo = new EquipmentRepo();
    const rows = await repo.viewAll(owner_id);
    
    return res.send(rows);
  },

  async viewOne(req: Request, res: Response) {
    const equipment_id = req.params.equipment_id;
    const owner_id     = NOBSC_USER_ID;

    const repo = new EquipmentRepo();
    const row = await repo.viewOne({owner_id, equipment_id});

    return res.send(row);
  }
};
