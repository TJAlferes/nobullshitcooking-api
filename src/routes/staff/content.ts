import { Router } from 'express';
import { body } from 'express-validator';
import { Pool } from 'mysql2/promise';

import { StaffContentController } from '../../controllers/staff';
import { catchExceptions, staffIsAuth } from '../../lib/utils';

const router = Router();

// for /staff/content/...

export function staffContentRouter(pool: Pool) {
  const controller = new StaffContentController(pool);

  router.post(
    '/create',
    staffIsAuth,
    [
      body('contentTypeId').not().isEmpty().trim().escape(),
      body('published').not().isEmpty().trim().escape(),
      body('title').not().isEmpty().trim().escape(),
      body('items').not().isEmpty().trim().escape()
    ],
    catchExceptions(controller.create)
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
    catchExceptions(controller.update)
  );

  router.delete(
    '/delete',
    staffIsAuth,
    [body('id').not().isEmpty().trim().escape()],
    catchExceptions(controller.delete)
  );

  return router;
}