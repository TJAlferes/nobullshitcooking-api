import { Router } from 'express';
import { body } from 'express-validator';
import { Pool } from 'mysql2/promise';
import { Client } from '@elastic/elasticsearch';

import { UserRecipeController } from '../../controllers/user/recipe';
import { catchExceptions } from '../../lib/utils/catchExceptions';
import { userIsAuth } from '../../lib/utils/userIsAuth';

const router = Router();

// for /user/recipe/...

export function userRecipeRouter(esClient: Client, pool: Pool) {
  const controller = new UserRecipeController(esClient, pool);

  router.post(
    '/create',
    userIsAuth,
    [
      body('recipeTypeId').not().isEmpty().trim().escape(),
      body('cuisineId').not().isEmpty().trim().escape(),
      body('title').not().isEmpty().trim().escape(),
      body('description').not().isEmpty().trim().escape(),
      body('activeTime').not().isEmpty().trim().escape(),
      body('totalTime').not().isEmpty().trim().escape(),
      body('directions').not().isEmpty().trim().escape(),
      body('recipeImage').not().isEmpty().trim().escape(),
      body('equipmentImage').not().isEmpty().trim().escape(),
      body('ingredientsImage').not().isEmpty().trim().escape(),
      body('cookingImage').not().isEmpty().trim().escape(),
      body('ownership').not().isEmpty().trim().escape()
    ],
    catchExceptions(controller.create)
  );

  router.put(
    '/update',
    userIsAuth,
    [
      body('id').not().isEmpty().trim().escape(),
      body('recipeTypeId').not().isEmpty().trim().escape(),
      body('cuisineId').not().isEmpty().trim().escape(),
      body('title').not().isEmpty().trim().escape(),
      body('description').not().isEmpty().trim().escape(),
      body('activeTime').not().isEmpty().trim().escape(),
      body('totalTime').not().isEmpty().trim().escape(),
      body('directions').not().isEmpty().trim().escape(),
      body('recipeImage').not().isEmpty().trim().escape(),
      body('equipmentImage').not().isEmpty().trim().escape(),
      body('ingredientsImage').not().isEmpty().trim().escape(),
      body('cookingImage').not().isEmpty().trim().escape(),
      body('ownership').not().isEmpty().trim().escape()
    ],
    catchExceptions(controller.update)
  );

  router.delete(
    '/delete/private',
    userIsAuth,
    [body('id').not().isEmpty().trim().escape()],
    catchExceptions(controller.deletePrivateById)
  );

  router.delete(
    '/disown/public',
    userIsAuth,
    [body('id').not().isEmpty().trim().escape()],
    catchExceptions(controller.disownById)
  );  // TO DO: change to router.put

  router.post(
    '/private/all',
    userIsAuth,
    catchExceptions(controller.viewPrivate)
  );

  router.post(
    '/public/all',
    userIsAuth,
    catchExceptions(controller.viewPublic)
  );

  router.post(
    '/private/one',
    userIsAuth,
    [body('id').not().isEmpty().trim().escape()],
    catchExceptions(controller.viewPrivateById)
  );

  router.post(
    '/public/one',
    userIsAuth,
    [body('id').not().isEmpty().trim().escape()],
    catchExceptions(controller.viewPublicById)
  );

  router.post(
    '/edit/private',
    userIsAuth,
    [body('id').not().isEmpty().trim().escape()],
    catchExceptions(controller.getInfoToEditPrivate)
  );

  router.post(
    '/edit/public',
    userIsAuth,
    [body('id').not().isEmpty().trim().escape()],
    catchExceptions(controller.getInfoToEditPublic)
  );

  return router;
}