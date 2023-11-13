import type { Request, Response } from 'express';

import { NotFoundException } from '../../utils/exceptions.js';
import { NOBSC_USER_ID } from '../shared/model.js';
import { EquipmentRepo } from './repo.js';

export const equipmentController = {
  async viewAll(req: Request, res: Response) {
    const owner_id = NOBSC_USER_ID;

    const repo = new EquipmentRepo();
    const equipment = await repo.viewAll(owner_id);
    
    return res.json(equipment);
  },

  async viewOne(req: Request, res: Response) {
    const { equipment_id } = req.params;
    const owner_id = NOBSC_USER_ID;

    const repo = new EquipmentRepo();
    const equipment = await repo.viewOne(equipment_id);
    if (!equipment) throw NotFoundException();
    if (equipment.owner_id !== owner_id) throw NotFoundException();  //ForbiddenException(); 

    return res.json(equipment);
  }
};
