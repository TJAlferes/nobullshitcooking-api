import { Request, Response } from 'express';

import {
  FavoriteRecipeRepo,
  SavedRecipeRepo,
  FriendshipRepo,
  PlanRepo,
  EquipmentRepo,
  IngredientRepo,
  RecipeRepo
} from '../../repos/mysql';

export class UserDataInitController {
  async viewInitialUserData(req: Request, res: Response) {
    const user_id = req.session.userInfo!.id;

    const favoriteRecipeRepo = new FavoriteRecipeRepo();
    const friendshipRepo     = new FriendshipRepo();
    const planRepo           = new PlanRepo();
    const equipmentRepo      = new EquipmentRepo();
    const ingredientRepo     = new IngredientRepo();
    const recipeRepo         = new RecipeRepo();
    const savedRecipeRepo    = new SavedRecipeRepo();

    const [
      myFavoriteRecipes,
      myFriendships,
      myPlans,
      myPrivateEquipment,
      myPrivateIngredients,
      myPrivateRecipes,
      myPublicRecipes,
      mySavedRecipes
    ] = await Promise.all([
      favoriteRecipeRepo.viewByUserId(user_id),
      friendshipRepo.view(user_id),
      planRepo.viewAll(user_id),
      equipmentRepo.viewAll(user_id, user_id),
      ingredientRepo.viewAll(user_id, user_id),
      recipeRepo.viewAll(user_id, user_id),
      recipeRepo.viewAll(user_id, 1),
      savedRecipeRepo.viewByUserId(user_id)
    ]);

    return res.send({
      myFavoriteRecipes,
      myFriendships,
      myPlans,
      myPrivateEquipment,
      myPrivateIngredients,
      myPrivateRecipes,
      myPublicRecipes,
      mySavedRecipes
    });
  }
}
