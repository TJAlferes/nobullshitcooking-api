import { Router } from 'express';
import { param }  from 'express-validator';

import { methodController as controller } from './controller';
import { catchExceptions } from '../../../utils';

const router = Router();

// for /methods

export function methodRouter() {
  router.get(
    '/:method_id',
    [param('method_id').not().isEmpty().trim().escape()],
    catchExceptions(controller.viewOne)
  );

  router.get('/', catchExceptions(controller.viewAll));

  return router;
}
