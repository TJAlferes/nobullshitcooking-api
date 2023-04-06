import { Router } from 'express';
import { body }   from 'express-validator';
import { Pool }   from 'mysql2/promise';

import { UserRecipeController }        from '../../controllers/user';
import { catchExceptions, userIsAuth } from '../../lib/utils';

const router = Router();

// for /user/recipe/...

export function userPublicRecipeRouter(pool: Pool) {
  const controller = new UserRecipeController(pool);  //UserPublicRecipeController
  
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

  router.post('/public/all',                                                     catchExceptions(controller.viewAllPublic));  //viewAll
  router.post('/public/one', [bodySanitizer('id')],                              catchExceptions(controller.viewOnePublic));  //viewOne
  router.post('/create',     userIsAuth, [bodySanitizer(recipeInfo)],            catchExceptions(controller.create));
  //router.post('/edit',       userIsAuth, [bodySanitizer(['id', ...recipeInfo])], catchExceptions(controller.edit));
  router.put('/update',      userIsAuth, [bodySanitizer(['id', ...recipeInfo])], catchExceptions(controller.update));
  router.delete('/disown',   userIsAuth, [bodySanitizer('title')],               catchExceptions(controller.disownOne));  // TO DO: router.put ?

  return router;
}

function bodySanitizer(keys: string | string[]) {
  return body(keys).not().isEmpty().trim().escape();
}
