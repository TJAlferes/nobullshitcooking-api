import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';
import { Client } from '@elastic/elasticsearch';

import { EquipmentSearch } from '../../access/elasticsearch';
import { Equipment } from '../../access/mysql';
import { validEquipment } from '../../lib/validations/entities';

export class StaffEquipmentController {
  esClient: Client;
  pool: Pool;

  constructor(esClient: Client, pool: Pool) {
    this.esClient = esClient;
    this.pool = pool;
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }
  
  async create(req: Request, res: Response) {
    const equipmentTypeId = Number(req.body.equipmentInfo.equipmentTypeId);
    const { name, description, image } = req.body.equipmentInfo;
    const authorId = 1;
    const ownerId = 1;

    const args = {equipmentTypeId, authorId, ownerId, name, description, image};
    assert(args, validEquipment);

    const equipment = new Equipment(this.pool);
    const createdEquipment = await equipment.create(args);
    const generatedId = createdEquipment.insertId;
    const [ equipmentForInsert ] =
      await equipment.getForElasticSearchById(generatedId);

    const equipmentSearch = new EquipmentSearch(this.esClient);
    await equipmentSearch.save(equipmentForInsert[0]);

    return res.send({message: 'Equipment created.'});
  }

  async update(req: Request, res: Response) {
    const id = Number(req.body.equipmentInfo.id);
    const equipmentTypeId = Number(req.body.equipmentInfo.equipmentTypeId);
    const { name, description, image } = req.body.equipmentInfo;
    const authorId = 1;
    const ownerId = 1;

    const args = {equipmentTypeId, authorId, ownerId, name, description, image};
    assert(args, validEquipment);

    const equipment = new Equipment(this.pool);
    await equipment.update({id, ...args});
    const [ equipmentForInsert ] = await equipment.getForElasticSearchById(id);

    const equipmentSearch = new EquipmentSearch(this.esClient);
    await equipmentSearch.save(equipmentForInsert[0]);

    return res.send({message: 'Equipment updated.'});
  }

  async delete(req: Request, res: Response) {
    const id = Number(req.body.id);
    const equipment = new Equipment(this.pool);
    const equipmentSearch = new EquipmentSearch(this.esClient);
    await equipment.delete(id);
    await equipmentSearch.delete(String(id));
    return res.send({message: 'Equipment deleted.'});
  }
}