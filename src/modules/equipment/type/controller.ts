import { Request, Response } from 'express';

import { EquipmentTypeRepo } from './repo';

export const equipmentTypeController = {
  async viewAll(req: Request, res: Response) {
    const repo = new EquipmentTypeRepo();
    const rows = await repo.viewAll();

    return res.send(rows);
  },

  async viewOne(req: Request, res: Response) {
    const equipment_type_id = Number(req.params.equipment_type_id);
    
    const repo = new EquipmentTypeRepo();
    const row = await repo.viewOne(equipment_type_id);

    return res.send(row);
  }
};
