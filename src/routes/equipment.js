const express = require('express');

const equipmentController = require('../controllers/equipment');

const router = express.Router();

// /v1/... ?
// catchExceptions()?

// for /equipment/...

router.post('/', equipmentController.viewEquipment);
router.get('/:equipmentId', equipmentController.viewEquipmentDetail);

module.exports = router;