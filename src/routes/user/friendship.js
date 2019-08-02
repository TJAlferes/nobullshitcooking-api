const { Router } = require('express');

const userIsAuth = require('../../lib/utils/userIsAuth');
const catchExceptions = require('../../lib/utils/catchExceptions');
const userFriendshipController = require('../../controllers/user/friendship');

const router = Router();

// /v1/... ?

// for /user/friendship/...

router.post(
  '/',
  userIsAuth,
  catchExceptions(userFriendshipController.viewAllMyFriendships)
);

router.post(
  '/create',
  userIsAuth,
  catchExceptions(userFriendshipController.createFriendship)
);

router.put(
  '/accept',
  userIsAuth,
  catchExceptions(userFriendshipController.acceptFriendship)
);

router.put(
  '/reject',
  userIsAuth,
  catchExceptions(userFriendshipController.rejectFriendship)
);

router.delete(
  '/delete',
  userIsAuth,
  catchExceptions(userFriendshipController.deleteFriendship)
);

router.post(
  '/block',
  userIsAuth,
  catchExceptions(userFriendshipController.blockUser)
);

router.delete(
  '/unblock',
  userIsAuth,
  catchExceptions(userFriendshipController.unblockUser)
);

module.exports = router;