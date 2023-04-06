import { Router } from 'express';
import { body }   from 'express-validator';
import { Pool }   from 'mysql2/promise';

import { UserRecipeController }        from '../../../controllers/user';
import { catchExceptions, userIsAuth } from '../../../lib/utils';

const router = Router();

// for /user/private/recipe/...

export function userPrivateRecipeRouter(pool: Pool) {
  const controller = new UserRecipeController(pool);  //UserPrivateRecipeController
  
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

  router.post('/all',      userIsAuth,                                         catchExceptions(controller.viewAllPrivate));  // only viewable by this logged in user
  router.post('/one',      userIsAuth, [bodySanitizer('id')],                  catchExceptions(controller.viewOnePrivate));  // only viewable by this logged in user
  router.post('/create',   userIsAuth, [bodySanitizer(recipeInfo)],            catchExceptions(controller.create));
  //router.post('/edit',     userIsAuth, [bodySanitizer(['id', ...recipeInfo])], catchExceptions(controller.edit));
  router.put('/update',    userIsAuth, [bodySanitizer(['id', ...recipeInfo])], catchExceptions(controller.update));
  router.delete('/delete', userIsAuth, [bodySanitizer('id')],                  catchExceptions(controller.deleteOne));

  return router;
}

function bodySanitizer(keys: string | string[]) {
  return body(keys).not().isEmpty().trim().escape();
}
