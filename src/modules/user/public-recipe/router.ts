import { Router } from 'express';
import { body }   from 'express-validator';

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
    sanitize('recipe_id'),
    catchExceptions(controller.viewOne)
  );  // is Next.js using this correctly??? OR is this method and endpoint correct???

  router.post(
    '/',
    userIsAuth,
    sanitize(recipe_upload),
    catchExceptions(controller.create)
  );

  router.get(
    '/edit',
    userIsAuth,
    sanitize('recipe_id'),
    catchExceptions(controller.edit)
  );  // move up above :recipe_id ???

  router.patch(
    '/',
    userIsAuth,
    sanitize(['recipe_id', ...recipe_upload]),
    catchExceptions(controller.update)
  );

  router.patch(
    '/disown',
    userIsAuth,
    sanitize('recipe_id'),
    catchExceptions(controller.disownOne)
  );

  return router;
}

function sanitize(keys: string | string[]) {
  return body(keys).not().isEmpty().trim().escape();
}
