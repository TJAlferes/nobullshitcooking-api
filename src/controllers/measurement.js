const pool = require('../lib/connections/mysqlPoolConnection');
const Measurement = require('../mysql-access/Measurement');
const validMeasurementRequest = require('../lib/validations/measurement/measurementRequest');

const measurementController = {
  viewAllMeasurements: async function(req, res, next) {
    try {
      const measurement = new Measurement(pool);
      const rows = await measurement.viewAllMeasurements();
      res.send(rows);
      next();
    } catch(err) {
      next(err);
    }
  },
  viewMeasurementById: async function(req, res, next) {
    try {
      const measurementId = req.sanitize(req.params.measurementId);
      validMeasurementRequest({measurementId});
      //if (measurementId < 1 || measurementId > 12) throw new Error('invalid measurement');
      const measurement = new Measurement(pool);
      const [ row ] = await measurement.viewMeasurementById(measurementId);
      res.send(row);
      next();
    } catch(err) {
      next(err);
    }
  }
};

module.exports = measurementController;