import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { CuisineEquipment } from '../../access/mysql/CuisineEquipment';

export class StaffCuisineEquipmentController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
  }
  
  async create(req: Request, res: Response) {
    const { cuisine, equipment } = req.body;

    const cuisineEquipment = new CuisineEquipment(this.pool);

    await cuisineEquipment.create(cuisine, equipment);

    return res.send({message: 'Cuisine equipment created.'});
  }

  async delete(req: Request, res: Response) {
    const { cuisine, equipment } = req.body;

    const cuisineEquipment = new CuisineEquipment(this.pool);

    await cuisineEquipment.delete(cuisine, equipment);
    
    return res.send({message: 'Cuisine equipment deleted.'});
  }
}