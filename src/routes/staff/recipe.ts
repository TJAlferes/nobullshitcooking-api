import { Router } from 'express';
import { body } from 'express-validator';
import { Pool } from 'mysql2/promise';
import { Client } from '@elastic/elasticsearch';

import { StaffRecipeController } from '../../controllers/staff/recipe';
import { catchExceptions } from '../../lib/utils/catchExceptions';
import { staffIsAuth } from '../../lib/utils/staffIsAuth';

const router = Router();

// for /staff/recipe/...

export function staffRecipeRouter(esClient: Client, pool: Pool) {
  const controller = new StaffRecipeController(esClient, pool);

  router.post(
    '/create',
    staffIsAuth,
    [
      body('type').not().isEmpty().trim().escape(),
      body('cuisine').not().isEmpty().trim().escape(),
      body('title').not().isEmpty().trim().escape(),
      body('description').not().isEmpty().trim().escape(),
      body('activeTime').not().isEmpty().trim().escape(),
      body('totalTime').not().isEmpty().trim().escape(),
      body('directions').not().isEmpty().trim().escape(),
      body('recipeImage').not().isEmpty().trim().escape(),
      body('equipmentImage').not().isEmpty().trim().escape(),
      body('ingredientsImage').not().isEmpty().trim().escape(),
      body('cookingImage').not().isEmpty().trim().escape(),
      body('video').not().isEmpty().trim().escape()
    ],
    catchExceptions(controller.create)
  );

  router.put(
    '/update',
    staffIsAuth,
    [
      body('id').not().isEmpty().trim().escape(),
      body('type').not().isEmpty().trim().escape(),
      body('cuisine').not().isEmpty().trim().escape(),
      body('title').not().isEmpty().trim().escape(),
      body('description').not().isEmpty().trim().escape(),
      body('activeTime').not().isEmpty().trim().escape(),
      body('totalTime').not().isEmpty().trim().escape(),
      body('directions').not().isEmpty().trim().escape(),
      body('recipeImage').not().isEmpty().trim().escape(),
      body('equipmentImage').not().isEmpty().trim().escape(),
      body('ingredientsImage').not().isEmpty().trim().escape(),
      body('cookingImage').not().isEmpty().trim().escape(),
      body('video').not().isEmpty().trim().escape()
    ],
    catchExceptions(controller.update)
  );

  router.delete(
    '/delete',
    staffIsAuth,
    [body('id').not().isEmpty().trim().escape()],
    catchExceptions(controller.delete)
  );

  return router;
}