import { Request, Response } from 'express';

import { EquipmentSearch } from '../../elasticsearch-access/EquipmentSearch';
import { esClient } from '../../lib/connections/elasticsearchClient';
import { pool } from '../../lib/connections/mysqlPoolConnection';
import {
  validEquipmentEntity
} from '../../lib/validations/equipment/equipmentEntity';
import { Equipment } from '../../mysql-access/Equipment';

export const staffEquipmentController = {
  createEquipment: async function(req: Request, res: Response) {
    const equipmentTypeId = Number(req.body.equipmentInfo.equipmentTypeId);
    const equipmentName = req.body.equipmentInfo.equipmentName;
    const equipmentDescription = req.body.equipmentInfo.equipmentDescription;
    const equipmentImage = req.body.equipmentInfo.equipmentImage;

    const authorId = 1;
    const ownerId = 1;

    const equipmentToCreate = validEquipmentEntity({
      equipmentTypeId,
      authorId,
      ownerId,
      equipmentName,
      equipmentDescription,
      equipmentImage
    });

    const equipment = new Equipment(pool);

    const createdEquipment = await equipment
    .createEquipment(equipmentToCreate);

    const generatedId = createdEquipment.insertId;

    const [ equipmentForInsert ] = await equipment
    .getEquipmentForElasticSearchInsert(generatedId);

    const equipmentInfo = {
      equipmentId: equipmentForInsert[0].equipmentId,
      equipmentTypeName: equipmentForInsert[0].equipmentTypeName,
      equipmentName: equipmentForInsert[0].equipmentName,
      equipmentImage: equipmentForInsert[0].equipmentImage
    };

    const equipmentSearch = new EquipmentSearch(esClient);

    await equipmentSearch.saveEquipment(equipmentInfo);

    res.send({message: 'Equipment created.'});
  },
  updateEquipment: async function(req: Request, res: Response) {
    const equipmentId = Number(req.body.equipmentInfo.equipmentId);
    const equipmentTypeId = Number(req.body.equipmentInfo.equipmentTypeId);
    const equipmentName = req.body.equipmentInfo.equipmentName;
    const equipmentDescription = req.body.equipmentInfo.equipmentDescription;
    const equipmentImage = req.body.equipmentInfo.equipmentImage;

    const authorId = 1;
    const ownerId = 1;

    const equipmentToUpdateWith = validEquipmentEntity({
      equipmentTypeId,
      authorId,
      ownerId,
      equipmentName,
      equipmentDescription,
      equipmentImage
    });

    const equipment = new Equipment(pool);

    await equipment.updateEquipment({equipmentId, ...equipmentToUpdateWith});

    const [ equipmentForInsert ] = await equipment
    .getEquipmentForElasticSearchInsert(equipmentId);

    const equipmentInfo = {
      equipmentId: equipmentForInsert[0].equipmentId,
      equipmentTypeName: equipmentForInsert[0].equipmentTypeName,
      equipmentName: equipmentForInsert[0].equipmentName,
      equipmentImage: equipmentForInsert[0].equipmentImage
    };

    const equipmentSearch = new EquipmentSearch(esClient);

    await equipmentSearch.saveEquipment(equipmentInfo);

    res.send({message: 'Equipment updated.'});
  },
  deleteEquipment: async function(req: Request, res: Response) {
    const equipmentId = Number(req.body.equipmentId);
    
    const equipment = new Equipment(pool);
    const equipmentSearch = new EquipmentSearch(esClient);

    await equipment.deleteEquipment(equipmentId);
    await equipmentSearch.deleteEquipment(String(equipmentId));

    res.send({message: 'Equipment deleted.'});
  }
};