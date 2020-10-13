import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';
import { Client } from '@elastic/elasticsearch';

import { EquipmentSearch } from '../../elasticsearch-access/EquipmentSearch';
import { validEquipmentEntity } from '../../lib/validations/equipment/entity';
import { Equipment } from '../../mysql-access/Equipment';

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
    const createdEquipment = await equipment.create(equipmentCreation);
    const generatedId = createdEquipment.insertId;
    const [ equipmentForInsert ] =
      await equipment.getForElasticSearch(generatedId);
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
    await equipment.update({id, ...equipmentUpdate});
    const [ equipmentForInsert ] = await equipment.getForElasticSearch(id);
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