const { Router } = require('express');

const catchExceptions = require('../lib/utils/catchExceptions');
const methodController = require('../controllers/method');

const router = Router();

// /v1/... ?

// for /method/...

router.get(
  '/',
  catchExceptions(methodController.viewAllMethods)
);

router.get(
  '/:methodId',
  catchExceptions(methodController.viewMethodById)
);

module.exports = router;