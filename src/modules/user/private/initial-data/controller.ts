import { Request, Response } from 'express';

import { FriendshipRepo }        from '../../friendship/repo';
import { PublicRecipeRepo }      from '../../public/recipe/repo';
import { PublicPlanRepo }        from '../../public/plan/repo';
import { FavoriteRecipeRepo }    from '../../public/favorite-recipe/repo';
import { PrivateEquipmentRepo }  from '../equipment/repo';
import { PrivateIngredientRepo } from '../ingredient/repo';
import { PrivatePlanRepo }       from '../plan/repo';
import { PrivateRecipeRepo }     from '../recipe/repo';
import { SavedRecipeRepo }       from '../saved-recipe/repo';

export const userInitialDataController = {
  async viewData(req: Request, res: Response) {
    const user_id = req.session.userInfo!.id;

    const friendshipRepo        = new FriendshipRepo();
    const publicRecipeRepo      = new PublicRecipeRepo();
    const publicPlanRepo        = new PublicPlanRepo();
    const favoriteRecipeRepo    = new FavoriteRecipeRepo();
    const privateEquipmentRepo  = new PrivateEquipmentRepo();
    const privateIngredientRepo = new PrivateIngredientRepo();
    const privatePlanRepo       = new PrivatePlanRepo();
    const privateRecipeRepo     = new PrivateRecipeRepo();
    const savedRecipeRepo       = new SavedRecipeRepo();

    const [
      my_friendships,
      my_public_plans,
      my_public_recipes,
      my_favorite_recipes,
      my_private_equipment,
      my_private_ingredients,
      my_private_plans,
      my_private_recipes,
      my_saved_recipes
    ] = await Promise.all([
      // change to viewForInitialUserData(user_id) ???
      friendshipRepo.view(user_id),
      publicPlanRepo.viewAll(user_id),
      publicRecipeRepo.viewAll(user_id),
      favoriteRecipeRepo.viewByUserId(user_id),
      privateEquipmentRepo.viewAll(user_id),
      privateIngredientRepo.viewAll(user_id),
      privatePlanRepo.viewAll(user_id),
      privateRecipeRepo.viewAll(user_id),
      savedRecipeRepo.viewByUserId(user_id)
    ]);

    return res.send({
      my_friendships,
      my_public_plans,
      my_public_recipes,
      my_favorite_recipes,
      my_private_equipment,
      my_private_ingredients,
      my_private_plans,
      my_private_recipes,
      my_saved_recipes
    });
  }
};
