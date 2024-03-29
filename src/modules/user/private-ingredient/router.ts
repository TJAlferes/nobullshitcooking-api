import { Router } from 'express';
import { body, param } from 'express-validator';

import { catchExceptions, userIsAuth } from '../../../utils';
import { privateIngredientController as controller } from './controller';

const router = Router({mergeParams: true});

// for /users/:username/private-ingredients

export function privateIngredientRouter() {
  const ingredientInfo = [
    'ingredient_type_id',
    'ingredient_brand',  // TO DO: make optional
    'ingredient_variety',  // TO DO: make optional
    'ingredient_name',
    'alt_names.*',  // TO DO: make optional
    'notes',
    'image_filename',
    'caption'  // TO DO: how is this passing through if '' ???
  ];

  router.get(
    '/:ingredient_id',
    userIsAuth,
    sanitizeParams('ingredient_id'),
    catchExceptions(controller.viewOne)
  );

  router.get(
    '/',
    userIsAuth,
    catchExceptions(controller.viewAll)
  );

  router.post(
    '/',
    userIsAuth,
    sanitizeBody(ingredientInfo),
    catchExceptions(controller.create)
  );

  router.patch(
    '/',
    userIsAuth,
    sanitizeBody(['ingredient_id', 'image_id', ...ingredientInfo]),
    catchExceptions(controller.update)
  );

  router.delete(
    '/:ingredient_id',
    userIsAuth,
    sanitizeParams('ingredient_id'),
    catchExceptions(controller.deleteOne)
  );

  return router;
}

function sanitizeBody(keys: string | string[]) {
  return body(keys).trim().notEmpty();
}

function sanitizeParams(keys: string | string[]) {
  return param(keys).trim().notEmpty();
}
