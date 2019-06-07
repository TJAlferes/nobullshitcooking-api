const pool = require('../data-access/dbPoolConnection');  // move?
const Measurement = require('../data-access/Measurement');

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
      const measurementId = req.params.measurementId;
      if (measurementId < 1 || measurementId > 12) throw new Error('invalid measurement');
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