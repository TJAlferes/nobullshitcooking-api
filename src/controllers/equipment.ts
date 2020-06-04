import { Request, Response } from 'express';

import { pool } from '../lib/connections/mysqlPoolConnection';
import {
  validEquipmentRequest
} from '../lib/validations/equipment/equipmentRequest';
import { Equipment } from '../mysql-access/Equipment';

export const equipmentController = {
  viewEquipment: async function (req: Request, res: Response) {
    const equipment = new Equipment(pool);

    const rows = await equipment.viewEquipment();

    res.send(rows);
  },
  viewEquipmentById: async function(req: Request, res: Response) {
    const equipmentId = Number(req.params.equipmentId);

    validEquipmentRequest({equipmentId});

    const equipment = new Equipment(pool);

    const [ row ] = await equipment.viewEquipmentById(equipmentId);

    res.send(row);
  }
};