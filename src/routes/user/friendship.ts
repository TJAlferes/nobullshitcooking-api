const { Router } = require('express');
const { body } = require('express-validator');

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

module.exports = router;