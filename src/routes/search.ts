import { Router } from 'express';
import { Client } from '@elastic/elasticsearch';

import { SearchController } from '../controllers';
import { catchExceptions } from '../lib/utils';

const router = Router();

// for /search/...

export function searchRouter(esClient: Client) {
  const controller = new SearchController(esClient);

  /*router.post(
    '/auto/all',
    catchExceptions(controller.autoAll)
  );*/

  router.post(
    '/auto/equipment',
    catchExceptions(controller.autoEquipment)
  );

  router.post(
    '/auto/ingredients',
    catchExceptions(controller.autoIngredients)
  );

  router.post(
    '/auto/recipes',
    catchExceptions(controller.autoRecipes)
  );

  /*router.post(
    '/find/all',
    catchExceptions(controller.findAll)
  );*/

  router.post(
    '/find/equipment',
    catchExceptions(controller.findEquipment)
  );

  router.post(
    '/find/ingredients',
    catchExceptions(controller.findIngredients)
  );

  router.post(
    '/find/recipes',
    catchExceptions(controller.findRecipes)
  );

  return router;
}