import { Request, Response } from 'express';

const pool = require('../lib/connections/mysqlPoolConnection');
const Equipment = require('../mysql-access/Equipment');
const validEquipmentRequest = require('../lib/validations/equipment/equipmentRequest');

const equipmentController = {
  viewAllOfficialEquipment: async function (req: Request, res: Response) {
    const authorId = 1;
    const ownerId = 1;
    const equipment = new Equipment(pool);
    const rows = await equipment.viewEquipment(authorId, ownerId);
    res.send(rows);
  },
  viewEquipmentDetail: async function(req: Request, res: Response) {
    const equipmentId = Number(req.sanitize(req.params.equipmentId));
    const authorId = 1;
    const ownerId = 1;
    validEquipmentRequest({equipmentId});
    const equipment = new Equipment(pool);
    const [ row ] = await equipment.viewEquipmentById(equipmentId, authorId, ownerId);
    res.send(row);
  }
};

module.exports = equipmentController;