import { Router } from 'express';
import { body } from 'express-validator';
import { Pool } from 'mysql2/promise';

import { UserContentController } from '../../controllers/user/content';
import { catchExceptions } from '../../lib/utils/catchExceptions';
import { userIsAuth } from '../../lib/utils/userIsAuth';

const router = Router();

// for /user/content/...

export function userContentRouter(pool: Pool) {
  const controller = new UserContentController(pool);

  router.post(
    '/all',
    userIsAuth,
    catchExceptions(controller.view)
  );

  router.post(
    '/one',
    userIsAuth,
    [body('id').not().isEmpty().trim().escape()],
    catchExceptions(controller.viewById)
  );

  router.post(
    '/subscribed/all',
    userIsAuth,
    catchExceptions(controller.viewAllMySubcribedContent)
  );

  router.post(
    '/create',
    userIsAuth,
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
    userIsAuth,
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
    userIsAuth,
    [body('id').not().isEmpty().trim().escape()],
    catchExceptions(controller.delete)
  );

  return router;
}