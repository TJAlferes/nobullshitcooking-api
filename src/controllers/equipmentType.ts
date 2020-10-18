import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { EquipmentType } from '../access/mysql/EquipmentType';

export class EquipmentTypeController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
    this.viewByName = this.viewByName.bind(this);
  }

  async view(req: Request, res: Response) {
    const equipmentType = new EquipmentType(this.pool);

    const rows = await equipmentType.view();

    return res.send(rows);
  }

  async viewByName(req: Request, res: Response) {
    const { name } = req.params;

    const equipmentType = new EquipmentType(this.pool);

    const [ row ] = await equipmentType.viewByName(name);
    
    return res.send(row);
  }
}