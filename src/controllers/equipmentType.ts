import { Request, Response } from 'express';

import { pool } from '../lib/connections/mysqlPoolConnection';
import { EquipmentType } from '../mysql-access/EquipmentType';

export const equipmentTypeController = {
  viewEquipmentTypes: async function(req: Request, res: Response) {
    const equipmentType = new EquipmentType(pool);

    const rows = await equipmentType.viewEquipmentTypes();

    return res.send(rows);
  },
  viewEquipmentTypeById: async function(req: Request, res: Response) {
    const equipmentTypeId = Number(req.params.equipmentTypeId);

    const equipmentType = new EquipmentType(pool);

    const [ row ] = await equipmentType.viewEquipmentTypeById(equipmentTypeId);
    
    return res.send(row);
  }
};