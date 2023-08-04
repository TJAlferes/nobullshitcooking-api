import { Router } from 'express';

import { UserDataInitController }      from '../../controllers/user';
import { catchExceptions, userIsAuth } from '../../lib/utils';

const router = Router();

// for /user/data-init/...

export function userDataInitRouter() {
  const controller = new UserDataInitController();

  router.post('/', userIsAuth, catchExceptions(controller.viewInitialUserData));

  return router;
}
