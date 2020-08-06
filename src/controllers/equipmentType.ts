import { Request, Response } from 'express';

import { pool } from '../lib/connections/mysqlPoolConnection';
import { EquipmentType } from '../mysql-access/EquipmentType';

export const equipmentTypeController = {
  view: async function(req: Request, res: Response) {
    const equipmentType = new EquipmentType(pool);

    const rows = await equipmentType.view();

    return res.send(rows);
  },
  viewById: async function(req: Request, res: Response) {
    const id = Number(req.params.id);

    const equipmentType = new EquipmentType(pool);

    const [ row ] = await equipmentType.viewById(id);
    
    return res.send(row);
  }
};