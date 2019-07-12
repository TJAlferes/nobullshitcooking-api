const { Router } = require('express');

const catchExceptions = require('../lib/utils/catchExceptions');
const friendshipController = require('../controllers/friendship');

const router = Router();

// /v1/... ?

// for /friendship/...

router.post(
  '/',
  catchExceptions(friendshipController.viewFriendshipsByUser)
);

router.post(
  '/create',
  catchExceptions(friendshipController.createFriendship)
);

router.post(
  '/accept',
  catchExceptions(friendshipController.acceptFriendship)
);

router.post(
  '/delete',
  catchExceptions(friendshipController.deleteFriendship)
);

module.exports = router;