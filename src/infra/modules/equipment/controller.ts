import { Request, Response } from 'express';

import { EquipmentService } from '../../app/services/Equipment';
import { EquipmentRepo } from '../repos/mysql';

export class EquipmentController {
  async viewAll(req: Request, res: Response) {
    const author_id = 1;  // TO DO: move to equipmentService
    const owner_id  = 1;  // TO DO: move to equipmentService

    const equipmentRepo = new EquipmentRepo();
    const equipmentService = new EquipmentService(equipmentRepo)
    const rows = await equipmentService.viewAll();
    return res.send(rows);
  }

  async viewOne(req: Request, res: Response) {
    const equipment_id = req.params.equipment_id;
    const author_id = 1;  // TO DO: move to equipmentService
    const owner_id  = 1;  // TO DO: move to equipmentService

    const equipmentRepo = new EquipmentRepo();
    const equipmentService = new EquipmentService(equipmentRepo)
    const row = await equipmentService.viewOne(equipment_id);
    return res.send(row);
  }
}
