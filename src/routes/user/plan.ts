import { Router } from 'express';
import { body } from 'express-validator';

import { userPlanController } from '../../controllers/user/plan';
import { catchExceptions } from '../../lib/utils/catchExceptions';
import { userIsAuth } from '../../lib/utils/userIsAuth';

export const router = Router();

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