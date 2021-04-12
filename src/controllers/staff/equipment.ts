import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';
import { Client } from '@elastic/elasticsearch';

import { EquipmentSearch } from '../../access/elasticsearch';
import { Equipment } from '../../access/mysql';
import { validEquipmentEntity } from '../../lib/validations/equipment/entity';

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
    const { type, name, description, image } = req.body.equipmentInfo;
    const author = "NOBSC";
    const owner = "NOBSC";

    const equipmentCreation = {type, author, owner, name, description, image};

    assert(equipmentCreation, validEquipmentEntity);

    const equipment = new Equipment(this.pool);

    await equipment.create(equipmentCreation);

    const generatedId = `${author} ${name}`;

    const [ equipmentForInsert ] =
      await equipment.getForElasticSearch(generatedId);
    
    const equipmentSearch = new EquipmentSearch(this.esClient);

    await equipmentSearch.save(equipmentForInsert[0]);

    return res.send({message: 'Equipment created.'});
  }

  async update(req: Request, res: Response) {
    const { id, type, name, description, image } = req.body.equipmentInfo;
    const author = "NOBSC";
    const owner = "NOBSC";

    const equipmentUpdate = {type, author, owner, name, description, image};

    assert(equipmentUpdate, validEquipmentEntity);

    const equipment = new Equipment(this.pool);

    await equipment.update({id, ...equipmentUpdate});

    const [ equipmentForInsert ] = await equipment.getForElasticSearch(id);

    const equipmentSearch = new EquipmentSearch(this.esClient);

    await equipmentSearch.save(equipmentForInsert[0]);
    
    return res.send({message: 'Equipment updated.'});
  }

  async delete(req: Request, res: Response) {
    const { id } = req.body;

    const equipment = new Equipment(this.pool);
    const equipmentSearch = new EquipmentSearch(this.esClient);

    await equipment.delete(id);
    await equipmentSearch.delete(id);

    return res.send({message: 'Equipment deleted.'});
  }
}