import { Router } from 'express';
import { body } from 'express-validator';
import { Pool } from 'mysql2/promise';

import { UserIngredientController } from '../../controllers/user';
import { catchExceptions, userIsAuth } from '../../lib/utils';

const router = Router();

// for /user/ingredient/...

export function userIngredientRouter(pool: Pool) {
  const controller = new UserIngredientController(pool);

  router.post('/all', userIsAuth, catchExceptions(controller.view));

  router.post('/one', userIsAuth, [body('id').not().isEmpty().trim().escape()], catchExceptions(controller.viewById));

  router.post('/create', userIsAuth, [
    body('ingredientTypeId').not().isEmpty().trim().escape(),
    body('brand').not().isEmpty().trim().escape(),
    body('variety').not().isEmpty().trim().escape(),
    body('name').not().isEmpty().trim().escape(),
    body('description').not().isEmpty().trim().escape(),
    body('image').not().isEmpty().trim().escape()
  ], catchExceptions(controller.create));

  router.put('/update', userIsAuth, [
    body('id').not().isEmpty().trim().escape(),
    body('ingredientTypeId').not().isEmpty().trim().escape(),
    body('brand').not().isEmpty().trim().escape(),
    body('variety').not().isEmpty().trim().escape(),
    body('name').not().isEmpty().trim().escape(),
    body('description').not().isEmpty().trim().escape(),
    body('image').not().isEmpty().trim().escape()
  ], catchExceptions(controller.update));

  router.delete('/delete', userIsAuth, [body('id').not().isEmpty().trim().escape()], catchExceptions(controller.delete));

  return router;
}