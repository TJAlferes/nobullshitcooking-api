import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import { Equipment } from '../../access/mysql/Equipment';
import { RecipeEquipment } from '../../access/mysql/RecipeEquipment';
import { validEquipmentEntity } from '../../lib/validations/equipment/entity';

export class UserEquipmentController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
    this.viewById = this.viewById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async view(req: Request, res: Response) {
    const authorId = req.session!.userInfo.id;
    const ownerId = req.session!.userInfo.id;
    const equipment = new Equipment(this.pool);
    const rows = await equipment.view(authorId, ownerId);
    return res.send(rows);
  }

  async viewById(req: Request, res: Response) {
    const id = Number(req.body.id);
    const authorId = req.session!.userInfo.id;
    const ownerId = req.session!.userInfo.id;
    const equipment = new Equipment(this.pool);
    const [ row ] = await equipment.viewById(id, authorId, ownerId);
    return res.send(row);
  }

  async create(req: Request, res: Response) {
    const equipmentTypeId = Number(req.body.equipmentInfo.equipmentTypeId);
    const { name, description, image } = req.body.equipmentInfo;
    const authorId = req.session!.userInfo.id;
    const ownerId = req.session!.userInfo.id;
    const equipmentCreation = {
      equipmentTypeId,
      authorId,
      ownerId,
      name,
      description,
      image
    };
    assert(equipmentCreation, validEquipmentEntity);
    const equipment = new Equipment(this.pool);
    await equipment.createPrivate(equipmentCreation);
    return res.send({message: 'Equipment created.'});
  }

  async update(req: Request, res: Response) {
    const id = Number(req.body.equipmentInfo.id);
    const equipmentTypeId = Number(req.body.equipmentInfo.equipmentTypeId);
    const { name, description, image } = req.body.equipmentInfo;
    const authorId = req.session!.userInfo.id;
    const ownerId = req.session!.userInfo.id;
    const equipmentUpdate = {
      equipmentTypeId,
      authorId,
      ownerId,
      name,
      description,
      image
    };
    assert(equipmentUpdate, validEquipmentEntity);
    const equipment = new Equipment(this.pool);
    await equipment.updatePrivate({id, ...equipmentUpdate});
    return res.send({message: 'Equipment updated.'});
  }

  async delete(req: Request, res: Response) {
    const id = Number(req.body.id);
    const ownerId = req.session!.userInfo.id;
    const recipeEquipment = new RecipeEquipment(this.pool);
    const equipment = new Equipment(this.pool);
    await recipeEquipment.deleteByEquipmentId(id);
    await equipment.deleteByOwnerId(id, ownerId);
    return res.send({message: 'Equipment deleted.'});
  }
}