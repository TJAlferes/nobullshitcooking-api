import { Request, Response } from 'express';

import { pool } from '../lib/connections/mysqlPoolConnection';
import { Equipment } from '../mysql-access/Equipment';
import { validEquipmentRequest } from '../lib/validations/equipment/equipmentRequest';

export const equipmentController = {
  viewAllOfficialEquipment: async function (req: Request, res: Response) {
    const authorId = 1;
    const ownerId = 1;
    const equipment = new Equipment(pool);
    const rows = await equipment.viewEquipment(authorId, ownerId);
    res.send(rows);
  },
  viewEquipmentDetail: async function(req: Request, res: Response) {
    const equipmentId = Number(req.params.equipmentId);
    const authorId = 1;
    const ownerId = 1;
    validEquipmentRequest({equipmentId});
    const equipment = new Equipment(pool);
    const [ row ] = await equipment.viewEquipmentById(equipmentId, authorId, ownerId);
    res.send(row);
  }
};