import { Router } from 'express';
import { body }   from 'express-validator';

import { catchExceptions, userIsAuth }               from '../../../utils';
import { privateIngredientController as controller } from './controller';

const router = Router();

// for /users/:username/private-ingredients

export function privateIngredientRouter() {
  const ingredientInfo = [
    'ingredient_type_id',
    'ingredient_brand',
    'ingredient_variety',
    'ingredient_name',
    'alt_names.*',
    'notes',
    'image_id'
  ];

  router.get(
    '/',
    userIsAuth,
    catchExceptions(controller.viewAll)
  );

  router.get(
    '/:ingredient_id',
    userIsAuth,
    sanitize('ingredient_id'),
    catchExceptions(controller.viewOne)
  );

  router.post(
    '/',
    userIsAuth,
    sanitize(ingredientInfo),
    catchExceptions(controller.create)
  );

  /*router.post(
    '/edit',
    userIsAuth,
    catchExceptions(controller.edit)
  );*/

  router.patch(
    '/',
    userIsAuth,
    sanitize(['ingredient_id', ...ingredientInfo]),
    catchExceptions(controller.update)
  );

  router.delete(
    '/',
    userIsAuth,
    sanitize('ingredient_id'),
    catchExceptions(controller.deleteOne)
  );

  return router;
}

function sanitize(keys: string | string[]) {
  return body(keys).not().isEmpty().trim().escape();
}
