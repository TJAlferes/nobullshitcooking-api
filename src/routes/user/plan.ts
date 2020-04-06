const { Router } = require('express');
import { body } from 'express-validator';

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
  [body('planId').not().isEmpty().trim().escape()],
  catchExceptions(userPlanController.viewMyPrivatePlan)
);

router.post(
  '/create',
  userIsAuth,
  [body('planName').not().isEmpty().trim().escape()],
  catchExceptions(userPlanController.createMyPrivatePlan)
);

router.put(
  '/update',
  userIsAuth,
  [
    body('planId').not().isEmpty().trim().escape(),
    body('planName').not().isEmpty().trim().escape()
  ],
  catchExceptions(userPlanController.updateMyPrivatePlan)
);

router.delete(
  '/delete',
  userIsAuth,
  [body('planId').not().isEmpty().trim().escape()],
  catchExceptions(userPlanController.deleteMyPrivatePlan)
);

module.exports = router;