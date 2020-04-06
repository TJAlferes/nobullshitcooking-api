import { Request, Response } from 'express';

const pool = require('../../lib/connections/mysqlPoolConnection');
const esClient = require('../../lib/connections/elasticsearchClient');

const Equipment = require('../../mysql-access/Equipment');

const EquipmentSearch = require('../../elasticsearch-access/EquipmentSearch');

const validEquipmentEntity = require('../../lib/validations/equipment/equipmentEntity');

const staffEquipmentController = {
  createEquipment: async function(req: Request, res: Response) {
    const equipmentTypeId = Number(req.sanitize(req.body.equipmentInfo.equipmentTypeId));
    const equipmentName = req.sanitize(req.body.equipmentInfo.equipmentName);
    const equipmentDescription = req.sanitize(req.body.equipmentInfo.equipmentDescription);
    const equipmentImage = req.sanitize(req.body.equipmentInfo.equipmentImage);

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
    const equipmentId = Number(req.sanitize(req.body.equipmentInfo.equipmentId));
    const equipmentTypeId = Number(req.sanitize(req.body.equipmentInfo.equipmentTypeId));
    const equipmentName = req.sanitize(req.body.equipmentInfo.equipmentName);
    const equipmentDescription = req.sanitize(req.body.equipmentInfo.equipmentDescription);
    const equipmentImage = req.sanitize(req.body.equipmentInfo.equipmentImage);

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
    const equipmentId = Number(req.sanitize(req.body.equipmentId));
    
    const equipment = new Equipment(pool);
    await equipment.deleteEquipment(equipmentId);

    const equipmentSearch = new EquipmentSearch(esClient);
    await equipmentSearch.deleteEquipment(equipmentId);

    res.send({message: 'Equipment deleted.'});
  }
};

module.exports = staffEquipmentController;