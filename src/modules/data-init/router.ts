import { Router } from 'express';

import { dataInitController } from './controller';
import { catchExceptions }    from '../../utils';

const router = Router();

// for /data-init/...

// RENAME, THIS IS TOO VAGUE
export function dataInitRouter() {
  router.get('/', catchExceptions(dataInitController.viewInitialData));

  return router;
}
