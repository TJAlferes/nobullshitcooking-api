const { Router } = require('express');

const catchExceptions = require('../lib/utils/catchExceptions');
const measurementController = require('../controllers/measurement');

const router = Router();

// /v1/... ?

// for /measurement/...

router.get(
  '/',
  catchExceptions(measurementController.viewAllMeasurements)
);

router.get(
  '/:measurementId',
  catchExceptions(measurementController.viewMeasurementById)
);

module.exports = router;