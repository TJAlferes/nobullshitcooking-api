import { Router } from 'express';
import { body } from 'express-validator';

import { userFriendshipController } from '../../controllers/user/friendship';
import { catchExceptions } from '../../lib/utils/catchExceptions';
import { userIsAuth } from '../../lib/utils/userIsAuth';

export const router = Router();

// for /user/friendship/...

router.post(
  '/',
  userIsAuth,
  catchExceptions(userFriendshipController.view)
);

router.post(
  '/create',
  userIsAuth,
  [body('friendname').not().isEmpty().trim().escape()],
  catchExceptions(userFriendshipController.create)
);

router.put(
  '/accept',
  userIsAuth,
  [body('friendname').not().isEmpty().trim().escape()],
  catchExceptions(userFriendshipController.accept)
);

router.put(
  '/reject',
  userIsAuth,
  [body('friendname').not().isEmpty().trim().escape()],
  catchExceptions(userFriendshipController.reject)
);

router.delete(
  '/delete',
  userIsAuth,
  [body('friendname').not().isEmpty().trim().escape()],
  catchExceptions(userFriendshipController.delete)
);

router.post(
  '/block',
  userIsAuth,
  [body('friendname').not().isEmpty().trim().escape()],
  catchExceptions(userFriendshipController.block)
);

router.delete(
  '/unblock',
  userIsAuth,
  [body('friendname').not().isEmpty().trim().escape()],
  catchExceptions(userFriendshipController.unblock)
);