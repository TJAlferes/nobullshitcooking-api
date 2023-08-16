import { Router } from 'express';

import { DataInitController } from './controller';
import { catchExceptions }    from '../../utils';

const router = Router();

// for /data-init/...

export function dataInitRouter() {
  const controller = new DataInitController();

  router.get('/', catchExceptions(controller.viewInitialData));

  return router;
}
