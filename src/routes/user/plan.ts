const { Router } = require('express');

const userIsAuth = require('../../lib/utils/userIsAuth');
const catchExceptions = require('../../lib/utils/catchExceptions');
const userPlanController = require('../../controllers/user/plan');

const router = Router();

// /v1/... ?

// for /user/plan/...

router.post(
  '/all',
  userIsAuth,
  catchExceptions(userPlanController.viewAllMyPrivatePlans)
);

router.post(
  '/one',
  userIsAuth,
  catchExceptions(userPlanController.viewMyPrivatePlan)
);

router.post(
  '/create',
  userIsAuth,
  catchExceptions(userPlanController.createMyPrivatePlan)
);

router.put(
  '/update',
  userIsAuth,
  catchExceptions(userPlanController.updateMyPrivatePlan)
);

router.delete(
  '/delete',
  userIsAuth,
  catchExceptions(userPlanController.deleteMyPrivatePlan)
);

module.exports = router;