import { Router } from 'express';
import { param } from 'express-validator';

import { contentController } from '../controllers/content';
import { catchExceptions } from '../lib/utils/catchExceptions';

export const router = Router();

// for /content/...

router.get(
  '/',
  catchExceptions(contentController.view)
);

router.get(
  '/links/:name',
  [param('name').not().isEmpty().trim().escape()],
  catchExceptions(contentController.getLinksByContentTypeName)
);

router.get(
  '/:id',
  [param('id').not().isEmpty().trim().escape()],
  catchExceptions(contentController.viewById)
);