import { Router } from 'express';
import { body }   from 'express-validator';

import { userPrivateRecipeController as controller } from './controller';
import { catchExceptions, userIsAuth } from '../../../../utils';

const router = Router();

// for /user/private/recipe/...

export function userPrivateRecipeRouter() {
  const recipeInfo = [
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
    catchExceptions(controller.viewAll)
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
    sanitize(recipeInfo),
    catchExceptions(controller.create)
  );

  /*router.post(
    '/edit',
    userIsAuth,
    sanitize(['id', ...recipeInfo]),
    catchExceptions(controller.edit)
  ); this is now handled with /one ??? */

  router.put(
    '/update',
    userIsAuth,
    sanitize(['recipe_id', ...recipeInfo]),
    catchExceptions(controller.update)
  );  // TO DO: what about prev images???

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
