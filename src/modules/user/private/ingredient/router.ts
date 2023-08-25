import { Router } from 'express';
import { body }   from 'express-validator';

import { userPrivateIngredientController as controller } from './controller';
import { catchExceptions, userIsAuth } from '../../../../utils';

const router = Router();

// for /user/private/ingredient/...

export function userPrivateIngredientRouter() {
  // TO DO: ingredient alt names
  const ingredientInfo = [
    'ingredient_type_id',
    'ingredient_brand',
    'ingredient_variety',
    'ingredient_name',
    'description',
    'image_id'
  ];

  router.post(
    '/all',
    userIsAuth,
    catchExceptions(controller.viewAll)
  );

  router.post(
    '/one',
    userIsAuth,
    sanitize('ingredient_id'),
    catchExceptions(controller.viewOne)
  );

  router.post(
    '/create',
    userIsAuth,
    sanitize(ingredientInfo),
    catchExceptions(controller.create)
  );

  /*router.post(
    '/edit',
    userIsAuth,
    catchExceptions(controller.edit)
  );*/

  router.put(
    '/update',
    userIsAuth,
    sanitize(['ingredient_id', ...ingredientInfo]),
    catchExceptions(controller.update)
  );

  router.delete(
    '/delete',
    userIsAuth,
    sanitize('ingredient_id'),
    catchExceptions(controller.deleteOne)
  );

  return router;
}

function sanitize(keys: string | string[]) {
  return body(keys).not().isEmpty().trim().escape();
}
