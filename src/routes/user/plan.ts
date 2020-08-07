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
  catchExceptions(userPlanController.view)
);

router.post(
  '/one',
  userIsAuth,
  [body('id').not().isEmpty().trim().escape()],
  catchExceptions(userPlanController.viewById)
);

router.post(
  '/create',
  userIsAuth,
  [body('name').not().isEmpty().trim().escape()],
  catchExceptions(userPlanController.create)
);

router.put(
  '/update',
  userIsAuth,
  [
    body('id').not().isEmpty().trim().escape(),
    body('name').not().isEmpty().trim().escape()
  ],
  catchExceptions(userPlanController.update)
);

router.delete(
  '/delete',
  userIsAuth,
  [body('id').not().isEmpty().trim().escape()],
  catchExceptions(userPlanController.delete)
);