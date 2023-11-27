import { Router } from 'express';
import { param } from 'express-validator';

import { catchExceptions } from '../../utils';
import { ingredientController as controller } from './controller';

const router = Router();

// for /ingredients

export function ingredientRouter() {
  router.get(
    '/fullnames',
    catchExceptions(controller.viewAllOfficialFullnames)
  );

  /*router.get(
    '/:fullname',
    [param('fullname').not().isEmpty().trim().escape()],
    catchExceptions(controller.viewOneByFullname)
  );*/

  router.get(
    '/:ingredient_id',
    [param('ingredient_id').not().isEmpty().trim().escape()],
    catchExceptions(controller.viewOne)
  );

  router.get('/', catchExceptions(controller.viewAll));

  return router;
}
