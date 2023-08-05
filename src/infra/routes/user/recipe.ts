import { Router } from 'express';
import { body }   from 'express-validator';

import { UserPublicRecipeController }  from '../../controllers/user';
import { catchExceptions, userIsAuth } from '../../lib/utils';

const router = Router();

// for /user/recipe/...

export function userPublicRecipeRouter() {
  const controller = new UserPublicRecipeController();
  
  // TO DO: sanitize the requireds with *
  const recipeInfo = [
    'ownership',
    'recipeTypeId',
    'cuisineId',
    'title',
    'description',
    'activeTime',
    'totalTime',
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
    '/public/all',
    catchExceptions(controller.viewAll)
  );

  router.post(
    '/public/one',
    sanitize('id'),
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
    sanitize(['id', ...recipeInfo]),
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
