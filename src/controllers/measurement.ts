import { Request, Response } from 'express';
import { assert } from 'superstruct';

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

    assert({measurementId}, validMeasurementRequest);

    const measurement = new Measurement(pool);

    const [ row ] = await measurement.viewMeasurementById(measurementId);
    
    res.send(row);
  }
};