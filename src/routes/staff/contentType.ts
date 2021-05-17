/*import { Router } from 'express';
import { body } from 'express-validator';
import { Pool } from 'mysql2/promise';

import { staffContentTypeController } from '../../controllers/staff';
import { catchExceptions, staffIsAuth } from '../../lib/utils';

export const router = Router();

// for /staff/content-type/...

router.post(
  '/create',
  staffIsAuth,
  [
    body('contentTypeId').not().isEmpty().trim().escape(),
    body('published').not().isEmpty().trim().escape(),
    body('items').not().isEmpty().trim().escape()
  ],
  catchExceptions(staffContentController.createContent)
);

router.put(
  '/update',
  staffIsAuth,
  [
    body('id').not().isEmpty().trim().escape(),
    body('contentTypeId').not().isEmpty().trim().escape(),
    body('published').not().isEmpty().trim().escape(),
    body('items').not().isEmpty().trim().escape()
  ],
  catchExceptions(staffContentController.updateContent)
);

router.delete(
  '/delete',
  staffIsAuth,
  [body('contentId').not().isEmpty().trim().escape()],
  catchExceptions(staffContentController.deleteContent)
);*/