import { Router } from 'express';
import { body } from 'express-validator';
import { Pool } from 'mysql2/promise';

import { UserRecipeController } from '../../controllers/user';
import { catchExceptions, userIsAuth } from '../../lib/utils';

const router = Router();

// for /user/recipe/...

export function userRecipeRouter(pool: Pool) {
  const controller = new UserRecipeController(pool);

  router.post('/create', userIsAuth, [body([
    'recipeTypeId',
    'cuisineId',
    'title',
    'description',
    'activeTime',
    'totalTime',
    'directions',
    'recipeImage',
    'equipmentImage',
    'ingredientsImage',
    'cookingImage',
    'ownership',
    'video'
  ]).not().isEmpty().trim().escape()], catchExceptions(controller.create));

  router.put('/update', userIsAuth, [body([
    'id',
    'recipeTypeId',
    'cuisineId',
    'title',
    'description',
    'activeTime',
    'totalTime',
    'directions',
    'recipeImage',
    'equipmentImage',
    'ingredientsImage',
    'cookingImage',
    'ownership',
    'video'
  ]).not().isEmpty().trim().escape()], catchExceptions(controller.update));

  router.delete('/delete/private', userIsAuth, [body('id').not().isEmpty().trim().escape()], catchExceptions(controller.delete));
  router.delete('/disown/public',  userIsAuth, [body('id').not().isEmpty().trim().escape()], catchExceptions(controller.disown));  // TO DO: change to router.put

  router.post('/private/all', userIsAuth, catchExceptions(controller.viewPrivate));
  router.post('/public/all',  userIsAuth, catchExceptions(controller.viewPublic));

  router.post('/private/one', userIsAuth, [body('id').not().isEmpty().trim().escape()], catchExceptions(controller.viewPrivateById));
  router.post('/public/one',  userIsAuth, [body('id').not().isEmpty().trim().escape()], catchExceptions(controller.viewPublicById));

  router.post('/edit/private', userIsAuth, [body('id').not().isEmpty().trim().escape()], catchExceptions(controller.editPrivate));
  router.post('/edit/public',  userIsAuth, [body('id').not().isEmpty().trim().escape()], catchExceptions(controller.editPublic));

  return router;
}