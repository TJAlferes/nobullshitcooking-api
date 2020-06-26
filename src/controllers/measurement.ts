import { Request, Response } from 'express';

import { pool } from '../lib/connections/mysqlPoolConnection';
import { Measurement } from '../mysql-access/Measurement';

export const measurementController = {
  viewMeasurements: async function(req: Request, res: Response) {
    const measurement = new Measurement(pool);

    const rows = await measurement.viewMeasurements();

    return res.send(rows);
  },
  viewMeasurementById: async function(req: Request, res: Response) {
    const measurementId = Number(req.params.measurementId);

    const measurement = new Measurement(pool);

    const [ row ] = await measurement.viewMeasurementById(measurementId);
    
    return res.send(row);
  }
};