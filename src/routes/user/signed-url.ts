import { Router } from 'express';
import { body } from 'express-validator';

import { UserSignedUrlController as Controller } from '../../controllers/user';
import { catchExceptions, userIsAuth } from '../../lib/utils';

const router = Router();

// for /user/signed-url/...

export function userSignedUrlRouter() {
  router.post('/avatar',             userIsAuth, [body('fileType').not().isEmpty().trim().escape()], catchExceptions(Controller.avatar));
  router.post('/equipment',          userIsAuth, [body('fileType').not().isEmpty().trim().escape()], catchExceptions(Controller.equipment));
  router.post('/ingredient',         userIsAuth, [body('fileType').not().isEmpty().trim().escape()], catchExceptions(Controller.ingredient));
  router.post('/recipe',             userIsAuth, [body('fileType').not().isEmpty().trim().escape()], catchExceptions(Controller.recipe));
  router.post('/recipe-cooking',     userIsAuth, [body('fileType').not().isEmpty().trim().escape()], catchExceptions(Controller.recipeCooking));
  router.post('/recipe-equipment',   userIsAuth, [body('fileType').not().isEmpty().trim().escape()], catchExceptions(Controller.recipeEquipment));
  router.post('/recipe-ingredients', userIsAuth, [body('fileType').not().isEmpty().trim().escape()], catchExceptions(Controller.recipeIngredients));

  return router;
}