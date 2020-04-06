import { Request, Response } from 'express';

const pool = require('../lib/connections/mysqlPoolConnection');
const Measurement = require('../mysql-access/Measurement');
const validMeasurementRequest = require('../lib/validations/measurement/measurementRequest');

const measurementController = {
  viewAllMeasurements: async function(req: Request, res: Response) {
    const measurement = new Measurement(pool);
    const rows = await measurement.viewAllMeasurements();
    res.send(rows);
  },
  viewMeasurementById: async function(req: Request, res: Response) {
    const measurementId = Number(req.sanitize(req.params.measurementId));
    validMeasurementRequest({measurementId});
    //if (measurementId < 1 || measurementId > 12) return res.send('invalid measurement');
    const measurement = new Measurement(pool);
    const [ row ] = await measurement.viewMeasurementById(measurementId);
    res.send(row);
  }
};

module.exports = measurementController;