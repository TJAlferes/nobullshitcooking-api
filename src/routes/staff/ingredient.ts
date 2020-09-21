import { Router } from 'express';
import { body } from 'express-validator';
import { Pool } from 'mysql2/promise';

import { StaffIngredientController } from '../../controllers/staff/ingredient';
import { catchExceptions } from '../../lib/utils/catchExceptions';
import { staffIsAuth } from '../../lib/utils/staffIsAuth';

const router = Router();

// for /staff/ingredient/...

export function staffIngredientRouter(pool: Pool) {
  const controller = new StaffIngredientController(pool);

  router.post(
    '/create',
    staffIsAuth,
    [
      body('ingredientTypeId').not().isEmpty().trim().escape(),
      body('brand').not().isEmpty().trim().escape(),
      body('variety').not().isEmpty().trim().escape(),
      body('name').not().isEmpty().trim().escape(),
      body('description').not().isEmpty().trim().escape(),
      body('image').not().isEmpty().trim().escape()
    ],
    catchExceptions(controller.create)
  );

  router.put(
    '/update',
    staffIsAuth,
    [
      body('id').not().isEmpty().trim().escape(),
      body('ingredientTypeId').not().isEmpty().trim().escape(),
      body('brand').not().isEmpty().trim().escape(),
      body('variety').not().isEmpty().trim().escape(),
      body('name').not().isEmpty().trim().escape(),
      body('description').not().isEmpty().trim().escape(),
      body('image').not().isEmpty().trim().escape()
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