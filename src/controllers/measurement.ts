import { Request, Response } from 'express';

import { pool } from '../lib/connections/mysqlPoolConnection';
import { Measurement } from '../mysql-access/Measurement';

export const measurementController = {
  view: async function(req: Request, res: Response) {
    const measurement = new Measurement(pool);

    const rows = await measurement.view();

    return res.send(rows);
  },
  viewById: async function(req: Request, res: Response) {
    const id = Number(req.params.id);

    const measurement = new Measurement(pool);

    const [ row ] = await measurement.viewById(id);
    
    return res.send(row);
  }
};