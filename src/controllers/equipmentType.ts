import { Request, Response } from 'express';
import { assert } from 'superstruct';

import { pool } from '../lib/connections/mysqlPoolConnection';
import {
  validEquipmentTypeRequest
} from '../lib/validations/equipmentType/equipmentTypeRequest';
import { EquipmentType } from '../mysql-access/EquipmentType';

export const equipmentTypeController = {
  viewEquipmentTypes: async function(req: Request, res: Response) {
    const equipmentType = new EquipmentType(pool);

    const rows = await equipmentType.viewEquipmentTypes();

    return res.send(rows);
  },
  viewEquipmentTypeById: async function(req: Request, res: Response) {
    const equipmentTypeId = Number(req.params.equipmentTypeId);

    assert({equipmentTypeId}, validEquipmentTypeRequest);

    const equipmentType = new EquipmentType(pool);

    const [ row ] = await equipmentType.viewEquipmentTypeById(equipmentTypeId);
    
    return res.send(row);
  }
};