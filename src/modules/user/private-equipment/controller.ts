import { Request, Response } from 'express';

import { Equipment }     from '../../equipment/model';
import { EquipmentRepo } from '../../equipment/repo';

export const privateEquipmentController = {
  async viewAll(req: Request, res: Response) {
    const owner_id  = req.session.user_id!;

    const repo = new EquipmentRepo();
    const rows = await repo.viewAll(owner_id);

    return res.send(rows);
  },

  async viewOne(req: Request, res: Response) {
    const equipment_id = req.body.equipment_id;
    const owner_id     = req.session.user_id!;

    const repo = new EquipmentRepo();
    const row = await repo.viewOne({equipment_id, owner_id});

    return res.send(row);
  },

  async create(req: Request, res: Response) {
    const { equipment_name, notes, image_id } = req.body;
    const equipment_type_id = Number(req.body.equipment_type_id);
    const owner_id          = req.session.user_id!;

    const repo = new EquipmentRepo();
    const equipment = Equipment.create({
      equipment_type_id,
      owner_id,
      equipment_name,
      notes,
      image_id
    }).getDTO();
    await repo.insert(equipment);
    
    return res.send({message: 'Equipment created.'});
  },

  async update(req: Request, res: Response) {
    const { equipment_id, equipment_name, notes, image_id } = req.body;
    const equipment_type_id = Number(req.body.equipment_type_id);
    const owner_id          = req.session.user_id!;

    const repo = new EquipmentRepo();
    const equipment = Equipment.update({
      equipment_id,
      equipment_type_id,
      owner_id,
      equipment_name,
      notes,
      image_id
    }).getDTO();
    await repo.update(equipment);

    return res.send({message: 'Equipment updated.'});
  },

  async deleteOne(req: Request, res: Response) {
    const equipment_id = req.body.equipment_id;
    const owner_id     = req.session.user_id!;

    const repo = new EquipmentRepo();
    await repo.deleteOne({equipment_id, owner_id});

    return res.send({message: 'Equipment deleted.'});
  }
};
