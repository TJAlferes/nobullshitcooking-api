import type { Request, Response } from 'express';

import { NotFoundException } from '../../../utils/exceptions';
import { EquipmentTypeRepo } from './repo';

export const equipmentTypeController = {
  async viewAll(req: Request, res: Response) {
    const repo = new EquipmentTypeRepo();
    const equipment_types = await repo.viewAll();

    return res.json(equipment_types);
  },

  async viewOne(req: Request, res: Response) {
    const equipment_type_id = Number(req.params.equipment_type_id);
    
    const repo = new EquipmentTypeRepo();
    const equipment_type = await repo.viewOne(equipment_type_id);
    if (!equipment_type) throw new NotFoundException();

    return res.json(equipment_type);
  }
};
