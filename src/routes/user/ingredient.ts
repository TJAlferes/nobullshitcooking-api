import { Router } from 'express';
import { body } from 'express-validator';
import { Pool } from 'mysql2/promise';

import { UserIngredientController } from '../../controllers/user';
import { catchExceptions, userIsAuth } from '../../lib/utils';

const router = Router();

// for /user/ingredient/...

export function userIngredientRouter(pool: Pool) {
  const controller = new UserIngredientController(pool);

  router.post('/', userIsAuth, catchExceptions(controller.viewAll));

  router.post('/one', userIsAuth, [body('id').not().isEmpty().trim().escape()], catchExceptions(controller.viewOne));

  router.post('/create', userIsAuth, [body([
    'ingredientTypeId',
    'brand',
    'variety',
    'name',
    'description',
    'image'
  ]).not().isEmpty().trim().escape()], catchExceptions(controller.create));

  router.put('/update', userIsAuth, [body([
    'id',
    'ingredientTypeId',
    'brand',
    'variety',
    'name',
    'description',
    'image'
  ]).not().isEmpty().trim().escape()], catchExceptions(controller.update));

  router.delete('/delete', userIsAuth, [body('id').not().isEmpty().trim().escape()], catchExceptions(controller.deleteOne));

  return router;
}