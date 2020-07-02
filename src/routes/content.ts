import { Router } from 'express';
import { param } from 'express-validator';

import { contentController } from '../controllers/content';
import { catchExceptions } from '../lib/utils/catchExceptions';

export const router = Router();

// for /content/...

router.get(
  '/links/:contentTypeName',
  [param('contentTypeName').not().isEmpty().trim().escape()],
  catchExceptions(contentController.getContentLinksByTypeName)
);

router.get(
  '/:contentId',
  [param('contentId').not().isEmpty().trim().escape()],
  catchExceptions(contentController.viewContentById)
);