import { Request, Response } from 'express';

import { RecipeEquipmentRepo }  from '../../../recipe/required-equipment/repo';
import { PrivateEquipmentRepo } from './repo';
import { PrivateEquipment }     from './model';

export const privateEquipmentController = {
  async viewAll(req: Request, res: Response) {
    const owner_id  = req.session.userInfo!.id;

    const repo = new PrivateEquipmentRepo();
    const rows = await repo.viewAll(owner_id);

    return res.send(rows);
  },

  async viewOne(req: Request, res: Response) {
    const equipment_id = req.body.equipment_id;
    const owner_id     = req.session.userInfo!.id;

    const repo = new PrivateEquipmentRepo();
    const row = await repo.viewOne({equipment_id, owner_id});

    return res.send(row);
  },

  async create(req: Request, res: Response) {
    const { equipment_name, notes, image_id } = req.body.equipmentInfo;
    const equipment_type_id = Number(req.body.equipmentInfo.equipment_type_id);
    const owner_id          = req.session.userInfo!.id;

    const args = {
      equipment_type_id,
      owner_id,
      equipment_name,
      notes,
      image_id
    };

    const repo = new PrivateEquipmentRepo();
    const equipment = PrivateEquipment.create(args).getDTO();
    await repo.insert(equipment);
    
    return res.send({message: 'Equipment created.'});
  },

  async update(req: Request, res: Response) {
    const {
      equipment_id,
      equipment_name,
      notes,
      image_id
    } = req.body.equipmentInfo;
    const equipment_type_id = Number(req.body.equipmentInfo.equipment_type_id);
    const owner_id          = req.session.userInfo!.id;

    const args = {
      equipment_id,
      equipment_type_id,
      owner_id,
      equipment_name,
      notes,
      image_id
    };

    const repo = new PrivateEquipmentRepo();
    const equipment = PrivateEquipment.create(args).getDTO();
    await repo.update(equipment);

    return res.send({message: 'Equipment updated.'});
  },

  async deleteOne(req: Request, res: Response) {
    const equipment_id = req.body.equipment_id;
    const owner_id     = req.session.userInfo!.id;

    const recipeEquipmentRepo = new RecipeEquipmentRepo();
    await recipeEquipmentRepo.deleteByEquipmentId(equipment_id);

    const privateEquipmentRepo = new PrivateEquipmentRepo();
    await privateEquipmentRepo.deleteOne({equipment_id, owner_id});

    return res.send({message: 'Equipment deleted.'});
  }
};
