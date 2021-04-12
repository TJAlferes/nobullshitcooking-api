import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import { Equipment, RecipeEquipment } from '../../access/mysql';
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
    const author = req.session!.userInfo.username;
    const owner = req.session!.userInfo.username;

    const equipment = new Equipment(this.pool);

    const rows = await equipment.view(author, owner);

    return res.send(rows);
  }

  async viewById(req: Request, res: Response) {
    const { id } = req.body;
    const author = req.session!.userInfo.username;
    const owner = req.session!.userInfo.username;

    const equipment = new Equipment(this.pool);

    const [ row ] = await equipment.viewById(id, author, owner);

    return res.send(row);
  }

  async create(req: Request, res: Response) {
    const { type, name, description, image } = req.body.equipmentInfo;
    const author = req.session!.userInfo.username;
    const owner = req.session!.userInfo.username;

    const equipmentCreation = {type, author, owner, name, description, image};

    assert(equipmentCreation, validEquipmentEntity);

    const equipment = new Equipment(this.pool);

    await equipment.createPrivate(equipmentCreation);

    return res.send({message: 'Equipment created.'});
  }

  async update(req: Request, res: Response) {
    const { id, type, name, description, image } = req.body.equipmentInfo;
    const author = req.session!.userInfo.username;
    const owner = req.session!.userInfo.username;

    const equipmentUpdate = {type, author, owner, name, description, image};

    assert(equipmentUpdate, validEquipmentEntity);

    const equipment = new Equipment(this.pool);

    await equipment.updatePrivate({id, ...equipmentUpdate});

    return res.send({message: 'Equipment updated.'});
  }

  async delete(req: Request, res: Response) {
    const { id } = req.body;
    const owner = req.session!.userInfo.username;

    const recipeEquipment = new RecipeEquipment(this.pool);
    const equipment = new Equipment(this.pool);

    await recipeEquipment.deleteByEquipment(id);
    await equipment.deleteByOwner(id, owner);

    return res.send({message: 'Equipment deleted.'});
  }
}