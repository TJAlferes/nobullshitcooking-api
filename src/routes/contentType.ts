import { Router } from 'express';
import { param } from 'express-validator';

import { contentTypeController } from '../controllers/contentType';
import { catchExceptions } from '../lib/utils/catchExceptions';

export const router = Router();

// for /content-type/...

router.get(
  '/',
  catchExceptions(contentTypeController.view)
);

router.get(
  '/:id',
  [param('id').not().isEmpty().trim().escape()],
  catchExceptions(contentTypeController.viewById)
);