import { Router } from 'express';

import { catchExceptions, userIsAuth } from '../../../utils';
import { userInitialDataController as controller } from './controller';

const router = Router();

// for /user/initial-data/...

export function userInitialDataRouter() {
  router.post('/', userIsAuth, catchExceptions(controller.view));

  return router;
}
