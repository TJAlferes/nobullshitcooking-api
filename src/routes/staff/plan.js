const { Router } = require('express');

const staffIsAuth = require('../../lib/utils/staffIsAuth');
const catchExceptions = require('../../lib/utils/catchExceptions');
const staffPlanController = require('../../controllers/staff/plan');

const router = Router();

// /v1/... ?

// for /staff/plan/...

router.get(
  '/plan/view',
  staffIsAuth,
  catchExceptions(staffPlanController.viewPlan)
);

router.post(
  '/plan/update',
  staffIsAuth,
  catchExceptions(staffPlanController.updatePlan)
);

module.exports = router;