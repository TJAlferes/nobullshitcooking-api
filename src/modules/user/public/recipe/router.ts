import { Router } from 'express';
import { body }   from 'express-validator';

import { userPublicRecipeController as controller }  from './controller';
import { catchExceptions, userIsAuth } from '../../../../utils';

const router = Router();

// for /user/public/recipe/...

export function userPublicRecipeRouter() {
  // TO DO: sanitize the requireds with *
  const recipeInfo = [
    'ownership',
    'recipe_type_id',
    'cuisine_id',
    'title',
    'description',
    'active_time',
    'total_time',
    'directions',
    //'methods.*.id',
    //'equipment*',
    //'ingredients*',
    //'subrecipes*',
    'recipeImage',
    'equipmentImage',
    'ingredientsImage',
    'cookingImage',
    'video'
  ];

  router.post(
    '/all',
    catchExceptions(controller.viewAll)
  );

  router.post(
    '/one',
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
  );*/

  router.put(
    '/update',
    userIsAuth,
    sanitize(['recipe_id', ...recipeInfo]),
    catchExceptions(controller.update)
  );

  router.delete(
    '/disown',
    userIsAuth,
    sanitize('title'),
    catchExceptions(controller.disownOne)
  );  // router.put ?

  return router;
}

function sanitize(keys: string | string[]) {
  return body(keys).not().isEmpty().trim().escape();
}
