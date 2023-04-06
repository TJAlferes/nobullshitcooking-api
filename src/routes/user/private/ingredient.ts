import { Router } from 'express';
import { body }   from 'express-validator';
import { Pool }   from 'mysql2/promise';

import { UserIngredientController }    from '../../../controllers/user/private';
import { catchExceptions, userIsAuth } from '../../../lib/utils';

const router = Router();

// for /user/private/ingredient/...

export function userIngredientRouter(pool: Pool) {
  const controller = new UserIngredientController(pool);

  const ingredientInfo = [
    'ingredientTypeId',
    'brand',
    'variety',
    'name',
    'description',
    'image'
  ];

  router.post('/all',      userIsAuth,                                             catchExceptions(controller.viewAll));
  router.post('/one',      userIsAuth, [bodySanitizer('id')],                      catchExceptions(controller.viewOne));
  router.post('/create',   userIsAuth, [bodySanitizer(ingredientInfo)],            catchExceptions(controller.create));
  //router.post('/edit',     userIsAuth,                                             catchExceptions(controller.edit));
  router.put('/update',    userIsAuth, [bodySanitizer(['id', ...ingredientInfo])], catchExceptions(controller.update));
  router.delete('/delete', userIsAuth, [bodySanitizer('id')],                      catchExceptions(controller.deleteOne));

  return router;
}

function bodySanitizer(keys: string | string[]) {
  return body(keys).not().isEmpty().trim().escape();
}
