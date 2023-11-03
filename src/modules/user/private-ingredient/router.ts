import { Router } from 'express';
import { body, param } from 'express-validator';

import { catchExceptions, userIsAuth } from '../../../utils/index.js';
import { privateIngredientController as controller } from './controller.js';

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
    'image_filename',
    'caption'
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
  return body(keys).not().isEmpty().trim().escape();
}

function sanitizeParams(keys: string | string[]) {
  return param(keys).not().isEmpty().trim().escape();
}
