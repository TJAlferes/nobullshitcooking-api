import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import { Equipment, RecipeEquipment } from '../../access/mysql';
import { validEquipment } from '../../lib/validations';

export class StaffEquipmentController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }
  
  async create(req: Request, res: Response) {
    const equipmentTypeId = Number(req.body.equipmentInfo.equipmentTypeId);
    const { name, description, image } = req.body.equipmentInfo;
    const authorId = 1;
    const ownerId =  1;

    const args = {equipmentTypeId, authorId, ownerId, name, description, image};
    assert(args, validEquipment);

    const equipment = new Equipment(this.pool);
    await equipment.create(args);

    return res.send({message: 'Equipment created.'});
  }

  async update(req: Request, res: Response) {
    const id =              Number(req.body.equipmentInfo.id);
    const equipmentTypeId = Number(req.body.equipmentInfo.equipmentTypeId);
    const { name, description, image } = req.body.equipmentInfo;
    const authorId = 1;
    const ownerId =  1;

    const args = {equipmentTypeId, authorId, ownerId, name, description, image};
    assert(args, validEquipment);

    const equipment = new Equipment(this.pool);
    await equipment.update({id, ...args});

    return res.send({message: 'Equipment updated.'});
  }

  async delete(req: Request, res: Response) {
    const id =      Number(req.body.id);
    const ownerId = 1;

    const recipeEquipment = new RecipeEquipment(this.pool);
    await recipeEquipment.deleteByEquipmentId(id);

    const equipment = new Equipment(this.pool);
    await equipment.deleteById(id, ownerId);

    return res.send({message: 'Equipment deleted.'});
  }
}