import { Router } from 'express';
import { body } from 'express-validator';
import { Pool } from 'mysql2/promise';

import { StaffRecipeController } from '../../controllers/staff';
import { catchExceptions, staffIsAuth } from '../../lib/utils';

const router = Router();

// for /staff/recipe/...

export function staffRecipeRouter(pool: Pool) {
  const controller = new StaffRecipeController(pool);

  router.post('/create', staffIsAuth, [body([
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

  router.put('/update', staffIsAuth, [body([
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

  router.delete('/delete', staffIsAuth, [body('id').not().isEmpty().trim().escape()], catchExceptions(controller.delete));

  return router;
}