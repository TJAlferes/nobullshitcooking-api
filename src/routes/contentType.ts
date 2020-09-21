import { Router } from 'express';
import { param } from 'express-validator';
import { Pool } from 'mysql2/promise';

import { ContentTypeController } from '../controllers/contentType';
import { catchExceptions } from '../lib/utils/catchExceptions';

const router = Router();

// for /content-type/...

export function contentTypeRouter(pool: Pool) {
  const controller = new ContentTypeController(pool);

  router.get(
    '/',
    catchExceptions(controller.view)
  );
  
  router.get(
    '/:id',
    [param('id').not().isEmpty().trim().escape()],
    catchExceptions(controller.viewById)
  );

  return router;
}