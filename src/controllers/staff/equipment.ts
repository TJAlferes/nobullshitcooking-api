import { Request, Response } from 'express';

import { pool } from '../../lib/connections/mysqlPoolConnection';
import { esClient } from '../../lib/connections/elasticsearchClient';
import { Equipment } from '../../mysql-access/Equipment';
import { EquipmentSearch } from '../../elasticsearch-access/EquipmentSearch';
import { validEquipmentEntity } from '../../lib/validations/equipment/equipmentEntity';

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
    .getEquipmentForElasticSearchInsert(generatedId, ownerId);

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

    await equipment.updateEquipment(equipmentToUpdateWith, equipmentId);

    const [ equipmentForInsert ] = await equipment
    .getEquipmentForElasticSearchInsert(equipmentId, ownerId);

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
    await equipment.deleteEquipment(equipmentId);

    const equipmentSearch = new EquipmentSearch(esClient);
    await equipmentSearch.deleteEquipment(String(equipmentId));

    res.send({message: 'Equipment deleted.'});
  }
};