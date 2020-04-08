import { Request, Response } from 'express';

import { pool } from '../lib/connections/mysqlPoolConnection';
import { Measurement } from '../mysql-access/Measurement';
import { validMeasurementRequest } from '../lib/validations/measurement/measurementRequest';

export const measurementController = {
  viewAllMeasurements: async function(req: Request, res: Response) {
    const measurement = new Measurement(pool);
    const rows = await measurement.viewAllMeasurements();
    res.send(rows);
  },
  viewMeasurementById: async function(req: Request, res: Response) {
    const measurementId = Number(req.params.measurementId);
    validMeasurementRequest({measurementId});
    //if (measurementId < 1 || measurementId > 12) return res.send('invalid measurement');
    const measurement = new Measurement(pool);
    const [ row ] = await measurement.viewMeasurementById(measurementId);
    res.send(row);
  }
};