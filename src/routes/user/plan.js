const { Router } = require('express');

const userIsAuth = require('../../lib/utils/userIsAuth');
const catchExceptions = require('../../lib/utils/catchExceptions');
const userPlanController = require('../../controllers/user/plan');

const router = Router();

// /v1/... ?

// for /user/plan/...

router.get(
  '/plan/view',
  userIsAuth,
  catchExceptions(userPlanController.viewPlan)
);

router.post(
  '/plan/update',
  userIsAuth,
  catchExceptions(userPlanController.updatePlan)
);

module.exports = router;