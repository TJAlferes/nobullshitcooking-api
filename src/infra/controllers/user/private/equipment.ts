import { Request, Response } from 'express';
import { assert }            from 'superstruct';

import { EquipmentRepo, RecipeEquipmentRepo } from '../../../repos/mysql';
import { validEquipment }                     from '../../../lib/validations';

export class UserEquipmentController {
  async viewAll(req: Request, res: Response) {
    const author_id = req.session.userInfo!.id;
    const owner_id  = req.session.userInfo!.id;

    const equipmentRepo = new EquipmentRepo();
    const rows = await equipmentRepo.viewAll({author_id, owner_id});
    return res.send(rows);
  }

  async viewOne(req: Request, res: Response) {
    const equipment_id = req.body.equipment_id;
    const author_id    = req.session.userInfo!.id;
    const owner_id     = req.session.userInfo!.id;

    const equipmentRepo = new EquipmentRepo();
    const row = await equipmentRepo.viewOne({equipment_id, author_id, owner_id});
    return res.send(row);
  }

  async create(req: Request, res: Response) {
    const { equipment_name, description, image_id } = req.body.equipmentInfo;
    const equipment_type_id = Number(req.body.equipmentInfo.equipment_type_id);
    const author_id = req.session.userInfo!.id;
    const owner_id  = req.session.userInfo!.id;

    const args = {
      equipment_type_id,
      author_id,
      owner_id,
      equipment_name,
      description,
      image_id
    };
    assert(args, validEquipment);

    const equipmentRepo = new EquipmentRepo();
    await equipmentRepo.insert(args);
    
    return res.send({message: 'Equipment created.'});
  }

  async update(req: Request, res: Response) {
    const {
      equipment_id,
      equipment_name,
      description,
      image_id
    } = req.body.equipmentInfo;
    const equipment_type_id = Number(req.body.equipmentInfo.equipment_type_id);
    const author_id = req.session.userInfo!.id;
    const owner_id  = req.session.userInfo!.id;

    const args = {
      equipment_id,
      equipment_type_id,
      author_id,
      owner_id,
      equipment_name,
      description,
      image_id
    };
    assert(args, validEquipment);

    const equipmentRepo = new EquipmentRepo();
    await equipmentRepo.update(args);

    return res.send({message: 'Equipment updated.'});
  }

  async deleteOne(req: Request, res: Response) {
    const equipment_id = req.body.equipment_id;
    const owner_id     = req.session.userInfo!.id;

    const recipeEquipmentRepo = new RecipeEquipmentRepo();
    await recipeEquipmentRepo.deleteByEquipmentId(equipment_id);

    const equipmentRepo = new EquipmentRepo();
    await equipmentRepo.deleteOne({equipment_id, owner_id});

    return res.send({message: 'Equipment deleted.'});
  }
}
