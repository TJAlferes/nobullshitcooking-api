const pool = require('../data-access/dbPoolConnection');  // move?
const Measurement = require('../data-access/Measurement');

// object versus class?
const measurementController = {
  viewAllMeasurements: async function(req, res, next) {
    try {
      const measurement = new Measurement(pool);
      const [ rows ] = await measurement.viewAllMeasurements();
      res.send(rows);
      next();
    } catch(err) {
      next(err);
    }
  },
  viewMeasurementById: async function(req, res, next) {
    try {
      const measurementId = req.params.measurementId;  // sanitize and validate
      const measurement = new Measurement(pool);
      const [ rows ] = await measurement.viewMeasurementById(measurementId);
      res.send(rows);
      next();
    } catch(err) {
      next(err);
    }
  }
};

module.exports = measurementController;