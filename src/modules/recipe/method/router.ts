import { Router } from 'express';
import { param }  from 'express-validator';

import { MethodController } from './controller';
import { catchExceptions }  from '../../../utils';

const router = Router();

// for /method/...

export function methodRouter() {
  const controller = new MethodController();

  router.get('/', catchExceptions(controller.viewAll));
  
  router.get(
    '/:method_id',
    [param('method_id').not().isEmpty().trim().escape()],
    catchExceptions(controller.viewOne)
  );

  return router;
}
