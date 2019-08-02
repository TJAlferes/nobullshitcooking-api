const { Router } = require('express');

const catchExceptions = require('../lib/utils/catchExceptions');
const equipmentController = require('../controllers/equipment');

const router = Router();

// /v1/... ?

// for /equipment/...

/*
move

router.get(
  '/submit-edit-form',
  catchExceptions(async function(req, res, next) {
    try {
      const sql = `
        SELECT equipment_id, equipment_type_id, equipment_name
        FROM nobsc_equipment
        ORDER BY equipment_name ASC
      `;
      const [ rows ] = await pool.execute(sql);
      console.log('rows in equipment controller: ', rows);
      res.send(rows);
    } catch(err) {
      next(err);
    }
  })
);
*/

router.post(
  '/',
  catchExceptions(equipmentController.viewEquipment)
);

router.get(
  '/:equipmentId',
  catchExceptions(equipmentController.viewEquipmentDetail)
);

module.exports = router;