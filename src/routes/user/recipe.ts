import { Router } from 'express';
import { body }   from 'express-validator';
import { Pool }   from 'mysql2/promise';

import { UserRecipeController }        from '../../controllers/user';
import { catchExceptions, userIsAuth } from '../../lib/utils';

const router = Router();

// for /user/recipe/...

export function userRecipeRouter(pool: Pool) {
  const controller = new UserRecipeController(pool);
  
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
  const sanitizedId =    body('id').not().isEmpty().trim().escape();
  const sanitizedTitle = body('title').not().isEmpty().trim().escape();

  router.post('/private',     userIsAuth,                   catchExceptions(controller.viewAllPrivate));  // only viewable by this logged in user
  router.post('/private/one', userIsAuth, [sanitizedId],    catchExceptions(controller.viewOnePrivate));  // only viewable by this logged in user
  router.post('/public',                                    catchExceptions(controller.viewAllPublic));  // move? remove?
  router.post('/public/one',              [sanitizedTitle], catchExceptions(controller.viewOnePublic));  // move? remove?

  router.post('/create', userIsAuth, [body(recipeInfo).not().isEmpty().trim().escape()], catchExceptions(controller.create));

  router.put('/update',  userIsAuth, [body(['id', ...recipeInfo]).not().isEmpty().trim().escape()], catchExceptions(controller.update));

  router.delete('/delete',     userIsAuth, [sanitizedId], catchExceptions(controller.deleteOne));
  router.delete('/disown',     userIsAuth, [sanitizedId], catchExceptions(controller.disownOne));  // TO DO: router.put ?

  return router;
}
