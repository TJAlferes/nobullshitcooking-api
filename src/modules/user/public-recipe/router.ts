import { Router } from 'express';
import { body, param }   from 'express-validator';

import { catchExceptions, userIsAuth }          from '../../../utils';
import { publicRecipeController as controller } from './controller';

const router = Router();

// for /users/:username/public-recipes

export function publicRecipeRouter() {
  const recipe_upload = [
    'recipe_type_id',
    'cuisine_id',
    'title',
    'description',
    'active_time',
    'total_time',
    'directions',
    'required_methods.*',
    'required_equipment.*',
    'required_ingredients.*',
    'required_subrecipes.*',
    'recipe_image*',
    'equipment_image*',
    'ingredients_image*',
    'cooking_image*'
  ];

  router.get(
    '/',
    catchExceptions(controller.overviewAll)
  );

  router.get(
    '/:recipe_id',
    sanitizeParams('recipe_id'),
    catchExceptions(controller.viewOne)
  );  // is Next.js using this correctly??? OR is this method and endpoint correct???

  router.get(
    '/:recipe_id/edit',
    userIsAuth,
    sanitizeParams('recipe_id'),
    catchExceptions(controller.edit)
  );

  router.post(
    '/',
    userIsAuth,
    sanitizeBody(recipe_upload),
    catchExceptions(controller.create)
  );

  router.patch(
    '/:recipe_id/unattribute',
    userIsAuth,
    sanitizeParams('recipe_id'),
    catchExceptions(controller.unattributeOne)
  );

  router.patch(
    '/update',
    userIsAuth,
    sanitizeBody(['recipe_id', ...recipe_upload]),
    catchExceptions(controller.update)
  );

  return router;
}

function sanitizeBody(keys: string | string[]) {
  return body(keys).not().isEmpty().trim().escape();
}

function sanitizeParams(keys: string | string[]) {
  return param(keys).not().isEmpty().trim().escape();
}
