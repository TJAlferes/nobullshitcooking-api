import { Router } from 'express';
import { body } from 'express-validator';
import { Pool } from 'mysql2/promise';

import { StaffIngredientController } from '../../controllers/staff';
import { catchExceptions, staffIsAuth } from '../../lib/utils';

const router = Router();

// for /staff/ingredient/...

export function staffIngredientRouter(pool: Pool) {
  const controller = new StaffIngredientController(pool);

  router.post('/create', staffIsAuth, [body([
    'ingredientTypeId',
    'brand',
    'variety',
    'name',
    'description',
    'image'
  ]).not().isEmpty().trim().escape()], catchExceptions(controller.create));

  router.put('/update', staffIsAuth, [body([
    'id',
    'ingredientTypeId',
    'brand',
    'variety',
    'name',
    'description',
    'image'
  ]).not().isEmpty().trim().escape()], catchExceptions(controller.update));

  router.delete('/delete', staffIsAuth, [body('id').not().isEmpty().trim().escape()], catchExceptions(controller.delete));

  return router;
}