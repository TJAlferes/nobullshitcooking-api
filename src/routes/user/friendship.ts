import { Router } from 'express';
import { body } from 'express-validator';

import { userFriendshipController } from '../../controllers/user/friendship';
import { catchExceptions } from '../../lib/utils/catchExceptions';
import { userIsAuth } from '../../lib/utils/userIsAuth';

export const router = Router();

// /v1/... ?

// for /user/friendship/...

router.post(
  '/',
  userIsAuth,
  catchExceptions(userFriendshipController.viewMyFriendships)
);

router.post(
  '/create',
  userIsAuth,
  [body('friendname').not().isEmpty().trim().escape()],
  catchExceptions(userFriendshipController.createFriendship)
);

router.put(
  '/accept',
  userIsAuth,
  [body('friendname').not().isEmpty().trim().escape()],
  catchExceptions(userFriendshipController.acceptFriendship)
);

router.put(
  '/reject',
  userIsAuth,
  [body('friendname').not().isEmpty().trim().escape()],
  catchExceptions(userFriendshipController.rejectFriendship)
);

router.delete(
  '/delete',
  userIsAuth,
  [body('friendname').not().isEmpty().trim().escape()],
  catchExceptions(userFriendshipController.deleteFriendship)
);

router.post(
  '/block',
  userIsAuth,
  [body('friendname').not().isEmpty().trim().escape()],
  catchExceptions(userFriendshipController.blockUser)
);

router.delete(
  '/unblock',
  userIsAuth,
  [body('friendname').not().isEmpty().trim().escape()],
  catchExceptions(userFriendshipController.unblockUser)
);