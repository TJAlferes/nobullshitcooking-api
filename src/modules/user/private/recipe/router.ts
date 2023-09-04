import { Router } from 'express';
import { body }   from 'express-validator';

import { catchExceptions, userIsAuth }           from '../../../../utils';
import { privateRecipeController as controller } from './controller';

const router = Router();

// for /user/private/recipe/...

export function privateRecipeRouter() {
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
    'recipe_image',
    'equipment_image',
    'ingredients_image',
    'cooking_image'
  ];

  router.post(
    '/all',
    userIsAuth,
    catchExceptions(controller.overviewAll)
  );

  router.post(
    '/one',
    userIsAuth,
    sanitize('recipe_id'),
    catchExceptions(controller.viewOne)
  );

  router.post(
    '/create',
    userIsAuth,
    sanitize(recipe_upload),
    catchExceptions(controller.create)
  );

  router.post(
    '/edit',
    userIsAuth,
    sanitize('recipe_id'),
    catchExceptions(controller.edit)
  );

  router.put(
    '/update',
    userIsAuth,
    sanitize(['recipe_id', ...recipe_upload]),
    catchExceptions(controller.update)
  );

  router.delete(
    '/delete',
    userIsAuth,
    sanitize('recipe_id'),
    catchExceptions(controller.deleteOne)
  );

  return router;
}

function sanitize(keys: string | string[]) {
  return body(keys).not().isEmpty().trim().escape();
}
