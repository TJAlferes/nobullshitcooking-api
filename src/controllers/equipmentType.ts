import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { EquipmentType } from '../access/mysql/EquipmentType';

export class EquipmentTypeController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
    this.viewById = this.viewById.bind(this);
  }

  async view(req: Request, res: Response) {
    const equipmentType = new EquipmentType(this.pool);
    const rows = await equipmentType.view();
    return res.send(rows);
  }

  async viewById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const equipmentType = new EquipmentType(this.pool);
    const [ row ] = await equipmentType.viewById(id);
    return res.send(row);
  }
}