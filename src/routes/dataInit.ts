import { Router } from 'express';

import { dataInitController } from '../controllers/dataInit';
import { catchExceptions } from '../lib/utils/catchExceptions';

export const router = Router();

// for /data-init/...

router.get(
  '/',
  catchExceptions(dataInitController.viewInitialData)
);