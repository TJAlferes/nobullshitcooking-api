import type { Request, Response } from 'express';
import { create } from 'superstruct';

import { NotFoundException } from '../../utils/exceptions';
import { EquipmentRepo } from '../equipment/repo';
import { IngredientRepo } from '../ingredient/repo';
import { RecipeRepo } from '../recipe/repo';
import { SearchIndex, AutosuggestTerm, validSearchRequest } from './model';

export const searchController = {
  async autosuggest(req: Request, res: Response) {
    const index = SearchIndex(req.query.index as string);
    const term = AutosuggestTerm(req.query.term as string);
    
    if (index === 'equipment') {
      const repo = new EquipmentRepo();
      const found = await repo.autosuggest(term);

      return res.json(found);
    }

    if (index === 'ingredients') {
      const repo = new IngredientRepo();
      const found = await repo.autosuggest(term);

      return res.json(found);
    }

    if (index === 'recipes') {
      const repo = new RecipeRepo();
      const found = await repo.autosuggest(term);

      return res.json(found);
    }

    throw new NotFoundException();
  },

  async search(req: Request, res: Response) {
    const searchRequest = create(req.query, validSearchRequest);
    const index = SearchIndex(req.query.index as string);

    if (index === 'equipment') {
      const repo = new EquipmentRepo();
      const found = await repo.search(searchRequest);

      return res.json(found);
    }

    if (index === 'ingredients') {
      const repo = new IngredientRepo();
      const found = await repo.search(searchRequest);

      return res.json(found);
    }

    if (index === 'recipes') {
      const repo = new RecipeRepo();
      const found = await repo.search(searchRequest);

      return res.json(found);
    }

    throw new NotFoundException();
  }
};
