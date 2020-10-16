import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { Measurement } from '../access/mysql/Measurement';

export class MeasurementController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
    this.viewByName = this.viewByName.bind(this);
  }

  async view(req: Request, res: Response) {
    const measurement = new Measurement(this.pool);
    const rows = await measurement.view();
    return res.send(rows);
  }

  async viewByName(req: Request, res: Response) {
    const { name } = req.params;
    const measurement = new Measurement(this.pool);
    const [ row ] = await measurement.viewByName(name);
    return res.send(row);
  }
}