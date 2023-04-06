import { Request, Response } from 'express';
import { Pool }              from 'mysql2/promise';
import { assert }            from 'superstruct';

import { Equipment, RecipeEquipment } from '../../../access/mysql';
import { validEquipment }             from '../../../lib/validations';

export class UserEquipmentController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async viewAll(req: Request, res: Response) {
    const authorId = req.session.userInfo!.id;
    const ownerId =  req.session.userInfo!.id;

    const equipment = new Equipment(this.pool);
    const rows = await equipment.viewAll(authorId, ownerId);
    return res.send(rows);
  }

  async viewOne(req: Request, res: Response) {
    const id =       Number(req.body.id);
    const authorId = req.session.userInfo!.id;
    const ownerId =  req.session.userInfo!.id;

    const equipment = new Equipment(this.pool);
    const [ row ] = await equipment.viewOne(id, authorId, ownerId);
    return res.send(row);
  }

  async create(req: Request, res: Response) {
    const equipmentTypeId =              Number(req.body.equipmentInfo.equipmentTypeId);
    const { name, description, image } = req.body.equipmentInfo;
    const authorId =                     req.session.userInfo!.id;
    const ownerId =                      req.session.userInfo!.id;

    const args = {equipmentTypeId, authorId, ownerId, name, description, image};
    assert(args, validEquipment);

    const equipment = new Equipment(this.pool);
    await equipment.create(args);
    
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

    const equipment = new Equipment(this.pool);
    await equipment.update({id, ...args});

    return res.send({message: 'Equipment updated.'});
  }

  async deleteOne(req: Request, res: Response) {
    const id =      Number(req.body.id);
    const ownerId = req.session.userInfo!.id;

    const recipeEquipment = new RecipeEquipment(this.pool);
    await recipeEquipment.deleteByEquipmentId(id);

    const equipment = new Equipment(this.pool);
    await equipment.deleteOne(id, ownerId);

    return res.send({message: 'Equipment deleted.'});
  }
}
