import { Router } from 'express';
import { Client } from '@elastic/elasticsearch';

import { SearchController } from '../controllers/search';
import { catchExceptions } from '../lib/utils/catchExceptions';

const router = Router();

// for /search/...

export function searchRouter(esClient: Client) {
  const controller = new SearchController(esClient);

  /*router.post(
    '/autocomplete/all',
    catchExceptions(controller.autocompletePublicAll)
  );*/

  router.post(
    '/autocomplete/equipment',
    catchExceptions(controller.autocompletePublicEquipment)
  );

  router.post(
    '/autocomplete/ingredients',
    catchExceptions(controller.autocompletePublicIngredients)
  );

  router.post(
    '/autocomplete/recipes',
    catchExceptions(controller.autocompletePublicRecipes)
  );

  /*router.post(
    '/find/all',
    catchExceptions(controller.findPublicAll)
  );*/

  router.post(
    '/find/equipment',
    catchExceptions(controller.findPublicEquipment)
  );

  router.post(
    '/find/ingredients',
    catchExceptions(controller.findPublicIngredients)
  );

  router.post(
    '/find/recipes',
    catchExceptions(controller.findPublicRecipes)
  );

  return router;
}