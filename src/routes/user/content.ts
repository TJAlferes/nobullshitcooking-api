import { Router } from 'express';
import { body } from 'express-validator';

import { userContentController } from '../../controllers/user/content';
import { catchExceptions } from '../../lib/utils/catchExceptions';
import { userIsAuth } from '../../lib/utils/userIsAuth';

export const router = Router();

// for /user/content/...

router.post(
  '/all',
  userIsAuth,
  catchExceptions(userContentController.view)
);

router.post(
  '/one',
  userIsAuth,
  [body('id').not().isEmpty().trim().escape()],
  catchExceptions(userContentController.viewById)
);

router.post(
  '/subscribed/all',
  userIsAuth,
  catchExceptions(userContentController.viewAllMySubcribedContent)
);

router.post(
  '/create',
  userIsAuth,
  [
    body('contentTypeId').not().isEmpty().trim().escape(),
    body('published').not().isEmpty().trim().escape(),
    body('title').not().isEmpty().trim().escape(),
    body('items').not().isEmpty().trim().escape()
  ],
  catchExceptions(userContentController.create)
);

router.put(
  '/update',
  userIsAuth,
  [
    body('id').not().isEmpty().trim().escape(),
    body('contentTypeId').not().isEmpty().trim().escape(),
    body('published').not().isEmpty().trim().escape(),
    body('title').not().isEmpty().trim().escape(),
    body('items').not().isEmpty().trim().escape()
  ],
  catchExceptions(userContentController.update)
);

router.delete(
  '/delete',
  userIsAuth,
  [body('id').not().isEmpty().trim().escape()],
  catchExceptions(userContentController.delete)
);