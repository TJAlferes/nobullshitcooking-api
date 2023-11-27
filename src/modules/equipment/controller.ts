import type { Request, Response } from 'express';

import { NotFoundException } from '../../utils/exceptions';
import { NOBSC_USER_ID } from '../shared/model';
import { EquipmentRepo } from './repo';

export const equipmentController = {
  async viewAllOfficialNames(req: Request, res: Response) {
    const repo = new EquipmentRepo();
    const names = await repo.viewAllOfficialNames();

    return res.json(names);
  },  // for Next.js getStaticPaths

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
    if (!equipment) throw new NotFoundException();
    if (equipment.owner_id !== owner_id) throw new NotFoundException();  //ForbiddenException(); 

    return res.json(equipment);
  }
};
