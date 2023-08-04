import { Router } from 'express';
import { param }  from 'express-validator';

import { MethodController } from '../controllers';
import { catchExceptions }  from '../lib/utils';

const router = Router();

// for /method/...

export function methodRouter() {
  const controller = new MethodController();

  router.get('/', catchExceptions(controller.viewAll));
  router.get('/:id', [param('id').not().isEmpty().trim().escape()], catchExceptions(controller.viewOne));

  return router;
}
