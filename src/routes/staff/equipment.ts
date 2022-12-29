import { Router } from 'express';
import { body } from 'express-validator';
import { Pool } from 'mysql2/promise';
import { Client } from '@elastic/elasticsearch';

import { StaffEquipmentController } from '../../controllers/staff';
import { catchExceptions, staffIsAuth } from '../../lib/utils';

const router = Router();

// for /staff/equipment/...

export function staffEquipmentRouter(esClient: Client, pool: Pool) {
  const controller = new StaffEquipmentController(esClient, pool);

  router.post('/create', staffIsAuth, [
    body('equipmentTypeId').not().isEmpty().trim().escape(),
    body('name').not().isEmpty().trim().escape(),
    body('description').not().isEmpty().trim().escape(),
    body('image').not().isEmpty().trim().escape()
  ], catchExceptions(controller.create));

  router.put('/update', staffIsAuth, [
    body('id').not().isEmpty().trim().escape(),
    body('equipmentTypeId').not().isEmpty().trim().escape(),
    body('name').not().isEmpty().trim().escape(),
    body('description').not().isEmpty().trim().escape(),
    body('image').not().isEmpty().trim().escape()
  ], catchExceptions(controller.update));

  router.delete('/delete', staffIsAuth, [body('id').not().isEmpty().trim().escape()], catchExceptions(controller.delete));

  return router;
}