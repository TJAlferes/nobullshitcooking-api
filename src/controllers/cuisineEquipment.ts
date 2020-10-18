import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { CuisineEquipment } from '../access/mysql/CuisineEquipment';

export class CuisineEquipmentController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewByCuisine = this.viewByCuisine.bind(this);
  }

  async viewByCuisine(req: Request, res: Response) {
    const { cuisine } = req.params;

    const cuisineEquipment = new CuisineEquipment(this.pool);

    const rows = await cuisineEquipment.viewByCuisine(cuisine);
    
    return res.send(rows);
  }
}