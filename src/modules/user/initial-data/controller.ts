import { Request, Response } from 'express';

import { NOBSC_USER_ID }      from '../../shared/model';
import { EquipmentRepo }      from '../../equipment/repo';
import { IngredientRepo }     from '../../ingredient/repo';
import { PlanRepo }           from '../../plan/repo';
import { RecipeRepo }         from '../../recipe/repo';
import { FriendshipRepo }     from '../friendship/repo';
import { FavoriteRecipeRepo } from '../favorite-recipe/repo';
import { SavedRecipeRepo }    from '../saved-recipe/repo';

export const userInitialDataController = {
  async view(req: Request, res: Response) {
    const user_id = req.session.user_id!;

    const friendshipRepo     = new FriendshipRepo();
    const equipmentRepo      = new EquipmentRepo();
    const ingredientRepo     = new IngredientRepo();
    const planRepo           = new PlanRepo();
    const recipeRepo         = new RecipeRepo();
    const savedRecipeRepo    = new SavedRecipeRepo();
    const favoriteRecipeRepo = new FavoriteRecipeRepo();

    const [
      my_friendships,
      my_private_equipment,
      my_private_ingredients,
      my_private_plans,
      my_public_plans,
      my_private_recipes,
      my_public_recipes,
      my_saved_recipes,
      my_favorite_recipes
    ] = await Promise.all([
      friendshipRepo.viewAll(user_id),
      equipmentRepo.overviewAll(user_id),
      ingredientRepo.overviewAll(user_id),
      planRepo.overviewAll({
        author_id: user_id,
        owner_id:  user_id
      }),
      planRepo.overviewAll({
        author_id: user_id,
        owner_id:  NOBSC_USER_ID
      }),
      recipeRepo.overviewAll({
        author_id: user_id,
        owner_id:  user_id
      }),
      planRepo.overviewAll({
        author_id: user_id,
        owner_id:  NOBSC_USER_ID
      }),
      savedRecipeRepo.viewByUserId(user_id),
      favoriteRecipeRepo.viewByUserId(user_id)
    ]);

    return res.send({
      my_friendships,
      my_private_equipment,
      my_private_ingredients,
      my_private_plans,
      my_public_plans,
      my_private_recipes,
      my_public_recipes,
      my_saved_recipes,
      my_favorite_recipes
    });
  }
};
