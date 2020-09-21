import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { CuisineEquipment } from '../mysql-access/CuisineEquipment';

export class CuisineEquipmentController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewByCuisineId = this.viewByCuisineId.bind(this);
  }

  async viewByCuisineId(req: Request, res: Response) {
    const id = Number(req.params.id);
    const cuisineEquipment = new CuisineEquipment(this.pool);
    const rows = await cuisineEquipment.viewByCuisineId(id);
    return res.send(rows);
  }
}