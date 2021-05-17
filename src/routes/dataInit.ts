import { Router } from 'express';
import { Pool } from 'mysql2/promise';

import { DataInitController } from '../controllers';
import { catchExceptions } from '../lib/utils';

const router = Router();

// for /data-init/...

export function dataInitRouter(pool: Pool) {
  const controller = new DataInitController(pool);

  router.get(
    '/',
    catchExceptions(controller.viewInitialData)
  );

  return router;
}