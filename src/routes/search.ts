import { Router } from 'express';

import { searchController } from '../controllers/search';
import { catchExceptions } from '../lib/utils/catchExceptions';

export const router = Router();

// for /search/...

/*router.post(
  '/autocomplete/all',
  catchExceptions(searchController.autocompletePublicAll)
);*/

router.post(
  '/autocomplete/equipment',
  catchExceptions(searchController.autocompletePublicEquipment)
);

router.post(
  '/autocomplete/ingredients',
  catchExceptions(searchController.autocompletePublicIngredients)
);

router.post(
  '/autocomplete/recipes',
  catchExceptions(searchController.autocompletePublicRecipes)
);

/*router.post(
  '/find/all',
  catchExceptions(searchController.findPublicAll)
);*/

router.post(
  '/find/equipment',
  catchExceptions(searchController.findPublicEquipment)
);

router.post(
  '/find/ingredients',
  catchExceptions(searchController.findPublicIngredients)
);

router.post(
  '/find/recipes',
  catchExceptions(searchController.findPublicRecipes)
);