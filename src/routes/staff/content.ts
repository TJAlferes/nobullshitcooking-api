import { Router } from 'express';
import { body } from 'express-validator';

import { staffContentController } from '../../controllers/staff/content';
import { catchExceptions } from '../../lib/utils/catchExceptions';
import { staffIsAuth } from '../../lib/utils/staffIsAuth';

export const router = Router();

// /v1/... ?

// for /staff/content/...

router.post(
  '/create',
  staffIsAuth,
  [
    body('contentTypeId').not().isEmpty().trim().escape(),
    body('published').not().isEmpty().trim().escape(),
    body('title').not().isEmpty().trim().escape(),
    body('items').not().isEmpty().trim().escape()
  ],
  catchExceptions(staffContentController.create)
);

router.put(
  '/update',
  staffIsAuth,
  [
    body('id').not().isEmpty().trim().escape(),
    body('contentTypeId').not().isEmpty().trim().escape(),
    body('published').not().isEmpty().trim().escape(),
    body('title').not().isEmpty().trim().escape(),
    body('items').not().isEmpty().trim().escape()
  ],
  catchExceptions(staffContentController.update)
);

router.delete(
  '/delete',
  staffIsAuth,
  [body('id').not().isEmpty().trim().escape()],
  catchExceptions(staffContentController.delete)
);