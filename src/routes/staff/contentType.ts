/*import { Router } from 'express';
import { body } from 'express-validator';

import { staffContentTypeController } from '../../controllers/staff/contentType';
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
    body('contentItems').not().isEmpty().trim().escape()
  ],
  catchExceptions(staffContentController.createContent)
);

router.put(
  '/update',
  staffIsAuth,
  [
    body('contentId').not().isEmpty().trim().escape(),
    body('contentTypeId').not().isEmpty().trim().escape(),
    body('published').not().isEmpty().trim().escape(),
    body('contentItems').not().isEmpty().trim().escape()
  ],
  catchExceptions(staffContentController.updateContent)
);

router.delete(
  '/delete',
  staffIsAuth,
  [body('contentId').not().isEmpty().trim().escape()],
  catchExceptions(staffContentController.deleteContent)
);*/