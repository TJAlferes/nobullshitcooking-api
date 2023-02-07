import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { EquipmentType } from '../access/mysql';

export class EquipmentTypeController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewAll = this.viewAll.bind(this);
    this.viewOne = this.viewOne.bind(this);
  }

  async viewAll(req: Request, res: Response) {
    const equipmentType = new EquipmentType(this.pool);
    const rows = await equipmentType.viewAll();
    return res.send(rows);
  }

  async viewOne(req: Request, res: Response) {
    const id = Number(req.params.id);
    
    const equipmentType = new EquipmentType(this.pool);
    const [ row ] = await equipmentType.viewOne(id);
    return res.send(row);
  }
}