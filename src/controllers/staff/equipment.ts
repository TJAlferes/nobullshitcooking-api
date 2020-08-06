import { Request, Response } from 'express';
import { assert } from 'superstruct';

import { EquipmentSearch } from '../../elasticsearch-access/EquipmentSearch';
import { esClient } from '../../lib/connections/elasticsearchClient';
import { pool } from '../../lib/connections/mysqlPoolConnection';
import {
  validEquipmentEntity
} from '../../lib/validations/equipment/equipmentEntity';
import { Equipment } from '../../mysql-access/Equipment';

export const staffEquipmentController = {
  create: async function(req: Request, res: Response) {
    const equipmentTypeId = Number(req.body.equipmentInfo.equipmentTypeId);
    const { name, description, image } = req.body.equipmentInfo;

    const authorId = 1;
    const ownerId = 1;

    const equipmentToCreate = {
      equipmentTypeId,
      authorId,
      ownerId,
      name,
      description,
      image
    };

    assert(equipmentToCreate, validEquipmentEntity);

    const equipment = new Equipment(pool);

    const createdEquipment = await equipment.create(equipmentToCreate);

    const generatedId = createdEquipment.insertId;

    const [ equipmentForInsert ] =
      await equipment.getForElasticSearch(generatedId);

    const equipmentSearch = new EquipmentSearch(esClient);

    await equipmentSearch.save(equipmentForInsert[0]);

    return res.send({message: 'Equipment created.'});
  },
  update: async function(req: Request, res: Response) {
    const id = Number(req.body.equipmentInfo.id);
    const equipmentTypeId = Number(req.body.equipmentInfo.equipmentTypeId);
    const { name, description, image } = req.body.equipmentInfo;

    const authorId = 1;
    const ownerId = 1;

    const equipmentToUpdateWith = {
      equipmentTypeId,
      authorId,
      ownerId,
      name,
      description,
      image
    };

    assert(equipmentToUpdateWith, validEquipmentEntity);

    const equipment = new Equipment(pool);

    await equipment.update({id, ...equipmentToUpdateWith});

    const [ equipmentForInsert ] = await equipment.getForElasticSearch(id);
    
    const equipmentSearch = new EquipmentSearch(esClient);

    await equipmentSearch.save(equipmentForInsert[0]);

    return res.send({message: 'Equipment updated.'});
  },
  delete: async function(req: Request, res: Response) {
    const id = Number(req.body.id);
    
    const equipment = new Equipment(pool);
    const equipmentSearch = new EquipmentSearch(esClient);

    await equipment.delete(id);
    await equipmentSearch.delete(String(id));

    return res.send({message: 'Equipment deleted.'});
  }
};