import { Router } from 'express';

import { contentTypeController } from '../controllers/contentType';
import { catchExceptions } from '../lib/utils/catchExceptions';

export const router = Router();

// for /content-type/...

router.get(
  '/',
  catchExceptions(contentTypeController.viewContentTypes)
);

router.get(
  '/:contentTypeId',
  catchExceptions(contentTypeController.viewContentTypeById)
);