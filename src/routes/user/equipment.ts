import { Router } from 'express';
import { body } from 'express-validator';

import { userEquipmentController } from '../../controllers/user/equipment';
import { catchExceptions } from '../../lib/utils/catchExceptions';
import { userIsAuth } from '../../lib/utils/userIsAuth';

export const router = Router();

// for /user/equipment/...

router.post(
  '/all',
  userIsAuth,
  catchExceptions(userEquipmentController.view)
);

router.post(
  '/one',
  userIsAuth,
  [body('id').not().isEmpty().trim().escape()],
  catchExceptions(userEquipmentController.viewById)
);

router.post(
  '/create',
  userIsAuth,
  [
    body('equipmentTypeId').not().isEmpty().trim().escape(),
    body('name').not().isEmpty().trim().escape(),
    body('description').not().isEmpty().trim().escape(),
    body('image').not().isEmpty().trim().escape()
  ],
  catchExceptions(userEquipmentController.create)
);

router.put(
  '/update',
  userIsAuth,
  [
    body('equipmentId').not().isEmpty().trim().escape(),
    body('equipmentTypeId').not().isEmpty().trim().escape(),
    body('name').not().isEmpty().trim().escape(),
    body('description').not().isEmpty().trim().escape(),
    body('image').not().isEmpty().trim().escape()
  ],
  catchExceptions(userEquipmentController.update)
);

router.delete(
  '/delete',
  userIsAuth,
  [body('id').not().isEmpty().trim().escape()],
  catchExceptions(userEquipmentController.delete)
);