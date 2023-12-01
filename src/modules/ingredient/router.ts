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
    [param('fullname').trim().not().isEmpty()],
    catchExceptions(controller.viewOneByFullname)
  );

  return router;
}
