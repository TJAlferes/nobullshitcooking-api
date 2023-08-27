import { Router } from 'express';

import { catchExceptions }       from '../../utils';
import { initialDataController } from './controller';

const router = Router();

// for /initial-data/...

export function initialDataRouter() {
  router.get('/', catchExceptions(initialDataController.viewData));

  return router;
}
