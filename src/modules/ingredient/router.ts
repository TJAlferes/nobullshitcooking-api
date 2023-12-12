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
  
  router.get(
    '/:fullname',
    [param('fullname').trim().notEmpty()],
    catchExceptions(controller.viewOneByFullname)
  );

  router.get(
    '/',
    catchExceptions(controller.viewAll)
  );

  return router;
}
