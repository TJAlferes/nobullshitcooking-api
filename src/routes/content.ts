import { Router } from 'express';
import { param } from 'express-validator';
import { Pool } from 'mysql2/promise';

import { ContentController } from '../controllers/content';
import { catchExceptions } from '../lib/utils/catchExceptions';

const router = Router();

// for /content/...

export function contentRouter(pool: Pool) {
  const controller = new ContentController(pool);
  
  router.get(
    '/',
    catchExceptions(controller.view)
  );
  
  router.get(
    '/links/:name',
    [param('name').not().isEmpty().trim().escape()],
    catchExceptions(controller.getLinksByContentTypeName)
  );
  
  router.get(
    '/:id',
    [param('id').not().isEmpty().trim().escape()],
    catchExceptions(controller.viewById)
  );
  
  return router;
}