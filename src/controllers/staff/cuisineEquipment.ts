import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { CuisineEquipment } from '../../mysql-access/CuisineEquipment';

export class StaffCuisineEquipmentController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
  }
  
  async create(req: Request, res: Response) {
    const cuisineId = Number(req.body.cuisineId);
    const equipmentId = Number(req.body.equipmentId);
    const cuisineEquipment = new CuisineEquipment(this.pool);
    await cuisineEquipment.create(cuisineId, equipmentId);
    return res.send({message: 'Cuisine equipment created.'});
  }

  async delete(req: Request, res: Response) {
    const cuisineId = Number(req.body.cuisineId);
    const equipmentId = Number(req.body.equipmentId);
    const cuisineEquipment = new CuisineEquipment(this.pool);
    await cuisineEquipment.delete(cuisineId, equipmentId);
    return res.send({message: 'Cuisine equipment deleted.'});
  }
}