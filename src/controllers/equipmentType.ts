import { Request, Response } from 'express';

import { pool } from '../lib/connections/mysqlPoolConnection';
import { EquipmentType } from '../mysql-access/EquipmentType';
import { validEquipmentTypeRequest } from '../lib/validations/equipmentType/equipmentTypeRequest';

export const equipmentTypeController = {
  viewAllEquipmentTypes: async function(req: Request, res: Response) {
    const equipmentType = new EquipmentType(pool);
    const rows = await equipmentType.viewAllEquipmentTypes();
    res.send(rows);
  },
  viewEquipmentTypeById: async function(req: Request, res: Response) {
    const equipmentTypeId = Number(req.params.equipmentTypeId);
    validEquipmentTypeRequest({equipmentTypeId});
    //if (equipmentTypeId < 1 || equipmentTypeId > 5) return res.send('invalid equipment type');
    const equipmentType = new EquipmentType(pool);
    const [ row ] = await equipmentType.viewEquipmentTypeById(equipmentTypeId);
    res.send(row);
  }
};