import { Router } from 'express';
import { body } from 'express-validator';

import { userContentController } from '../../controllers/user/content';
import { catchExceptions } from '../../lib/utils/catchExceptions';
import { userIsAuth } from '../../lib/utils/userIsAuth';

export const router = Router();

// /v1/... ?

// for /user/content/...

router.post(
  '/all',
  userIsAuth,
  catchExceptions(userContentController.viewAllMyContent)
);

router.post(
  '/one',
  userIsAuth,
  [body('contentId').not().isEmpty().trim().escape()],
  catchExceptions(userContentController.viewMyContent)
);

router.post(
  '/subscribed/all',
  userIsAuth,
  catchExceptions(userContentController.viewAllMySubcribedContent)
);