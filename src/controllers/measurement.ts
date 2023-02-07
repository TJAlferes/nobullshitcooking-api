import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { Measurement } from '../access/mysql';

export class MeasurementController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool =    pool;
    this.viewAll = this.viewAll.bind(this);
    this.viewOne = this.viewOne.bind(this);
  }

  async viewAll(req: Request, res: Response) {
    const measurement = new Measurement(this.pool);
    const rows = await measurement.viewAll();
    return res.send(rows);
  }

  async viewOne(req: Request, res: Response) {
    const id = Number(req.params.id);
    
    const measurement = new Measurement(this.pool);
    const [ row ] = await measurement.viewOne(id);
    return res.send(row);
  }
}