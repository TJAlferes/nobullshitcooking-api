import { Router } from 'express';
import { body, param } from 'express-validator';

import { catchExceptions, userIsAuth } from '../../../utils';
import { publicRecipeController as controller } from './controller';

const router = Router({mergeParams: true});

// for /users/:username/public-recipes

export function publicRecipeRouter() {
  // TO DO: test image
  const recipe_upload = [
    'recipe_type_id',
    'cuisine_id',
    'title',
    'description',
    'active_time',
    'total_time',
    'directions',
    'required_methods.*.*',
    'required_equipment..**',
    'required_ingredients.*.*',
    'required_subrecipes.*.*',
    'recipe_image*',
    'equipment_image*',
    'ingredients_image*',
    'cooking_image*'
  ];

  router.get(
    '/:recipe_id/edit',
    userIsAuth,
    sanitizeParams('recipe_id'),
    catchExceptions(controller.edit)
  );

  router.get(
    '/:title',
    sanitizeParams('title'),
    catchExceptions(controller.viewOne)
  );

  router.get(
    '/',
    catchExceptions(controller.overviewAll)
  );

  router.post(
    '/',
    userIsAuth,
    sanitizeBody(recipe_upload),
    catchExceptions(controller.create)
  );

  router.patch(
    '/',
    userIsAuth,
    sanitizeBody(['recipe_id', ...recipe_upload]),
    catchExceptions(controller.update)
  );

  router.delete(
    '/:recipe_id',
    userIsAuth,
    sanitizeParams('recipe_id'),
    catchExceptions(controller.unattributeOne)
  );

  return router;
}

function sanitizeBody(keys: string | string[]) {
  return body(keys).trim().notEmpty();
}

function sanitizeParams(keys: string | string[]) {
  return param(keys).trim().notEmpty();
}
