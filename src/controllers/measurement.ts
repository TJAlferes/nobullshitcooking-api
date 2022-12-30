import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { Measurement } from '../access/mysql';

export class MeasurementController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view =     this.view.bind(this);
    this.viewById = this.viewById.bind(this);
  }

  async view(req: Request, res: Response) {
    const measurement = new Measurement(this.pool);
    const rows = await measurement.view();
    return res.send(rows);
  }

  async viewById(req: Request, res: Response) {
    const id = Number(req.params.id);
    
    const measurement = new Measurement(this.pool);
    const [ row ] = await measurement.viewById(id);
    return res.send(row);
  }
}