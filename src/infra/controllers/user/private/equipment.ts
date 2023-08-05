import { Request, Response } from 'express';
import { assert }            from 'superstruct';

import { EquipmentRepo, RecipeEquipmentRepo } from '../../../access/mysql';
import { validEquipment }                     from '../../../lib/validations';

export class UserEquipmentController {
  async viewAll(req: Request, res: Response) {
    const authorId = req.session.userInfo!.id;
    const ownerId =  req.session.userInfo!.id;

    const equipmentRepo = new EquipmentRepo();
    const rows = await equipmentRepo.viewAll(authorId, ownerId);
    return res.send(rows);
  }

  async viewOne(req: Request, res: Response) {
    const id =       Number(req.body.id);
    const authorId = req.session.userInfo!.id;
    const ownerId =  req.session.userInfo!.id;

    const equipmentRepo = new EquipmentRepo();
    const [ row ] = await equipmentRepo.viewOne(id, authorId, ownerId);
    return res.send(row);
  }

  async create(req: Request, res: Response) {
    const equipmentTypeId =              Number(req.body.equipmentInfo.equipmentTypeId);
    const { name, description, image } = req.body.equipmentInfo;
    const authorId =                     req.session.userInfo!.id;
    const ownerId =                      req.session.userInfo!.id;

    const args = {equipmentTypeId, authorId, ownerId, name, description, image};
    assert(args, validEquipment);

    const equipmentRepo = new EquipmentRepo();
    await equipmentRepo.create(args);
    
    return res.send({message: 'Equipment created.'});
  }

  async update(req: Request, res: Response) {
    const id =                           Number(req.body.equipmentInfo.id);
    const equipmentTypeId =              Number(req.body.equipmentInfo.equipmentTypeId);
    const { name, description, image } = req.body.equipmentInfo;
    const authorId =                     req.session.userInfo!.id;
    const ownerId =                      req.session.userInfo!.id;

    const args = {equipmentTypeId, authorId, ownerId, name, description, image};
    assert(args, validEquipment);

    const equipmentRepo = new EquipmentRepo();
    await equipmentRepo.update({id, ...args});

    return res.send({message: 'Equipment updated.'});
  }

  async deleteOne(req: Request, res: Response) {
    const id =      Number(req.body.id);
    const ownerId = req.session.userInfo!.id;

    const recipeEquipmentRepo = new RecipeEquipmentRepo();
    await recipeEquipmentRepo.deleteByEquipmentId(id);

    const equipmentRepo = new EquipmentRepo();
    await equipmentRepo.deleteOne(id, ownerId);

    return res.send({message: 'Equipment deleted.'});
  }
}
