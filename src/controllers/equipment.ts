import { Request, Response } from 'express';
import { assert } from 'superstruct';

import { pool } from '../lib/connections/mysqlPoolConnection';
import {
  validEquipmentRequest
} from '../lib/validations/equipment/equipmentRequest';
import { Equipment } from '../mysql-access/Equipment';

export const equipmentController = {
  viewEquipment: async function (req: Request, res: Response) {
    const authorId = 1;
    const ownerId = 1;

    const equipment = new Equipment(pool);

    const rows = await equipment.viewEquipment(authorId, ownerId);

    return res.send(rows);
  },
  viewEquipmentById: async function(req: Request, res: Response) {
    const equipmentId = Number(req.params.equipmentId);
    const authorId = 1;
    const ownerId = 1;

    assert({equipmentId}, validEquipmentRequest);

    const equipment = new Equipment(pool);

    const [ row ] = await equipment
    .viewEquipmentById(equipmentId, authorId, ownerId);

    return res.send(row);
  }
};