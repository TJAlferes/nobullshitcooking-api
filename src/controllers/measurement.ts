import { Request, Response } from 'express';

import { pool } from '../lib/connections/mysqlPoolConnection';
import {
  validMeasurementRequest
} from '../lib/validations/measurement/measurementRequest';
import { Measurement } from '../mysql-access/Measurement';

export const measurementController = {
  viewMeasurements: async function(req: Request, res: Response) {
    const measurement = new Measurement(pool);

    const rows = await measurement.viewMeasurements();

    res.send(rows);
  },
  viewMeasurementById: async function(req: Request, res: Response) {
    const measurementId = Number(req.params.measurementId);

    validMeasurementRequest({measurementId});

    const measurement = new Measurement(pool);

    const [ row ] = await measurement.viewMeasurementById(measurementId);
    
    res.send(row);
  }
};