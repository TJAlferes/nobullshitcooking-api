import { Request, Response } from 'express';

import {
  FavoriteRecipeRepo,
  SavedRecipeRepo,
  FriendshipRepo,
  PlanRepo,
  EquipmentRepo,
  IngredientRepo,
  RecipeRepo
} from '../../access/mysql';

export class UserDataInitController {
  async viewInitialUserData(req: Request, res: Response) {
    const userId = req.session.userInfo!.id;

    const favoriteRecipeRepo = new FavoriteRecipeRepo();
    const friendshipRepo =     new FriendshipRepo();
    const planRepo =           new PlanRepo();
    const equipmentRepo =      new EquipmentRepo();
    const ingredientRepo =     new IngredientRepo();
    const recipeRepo =         new RecipeRepo();
    const savedRecipeRepo =    new SavedRecipeRepo();

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
      favoriteRecipeRepo.viewByUserId(userId),
      friendshipRepo.view(userId),
      planRepo.viewAll(userId),
      equipmentRepo.viewAll(userId, userId),
      ingredientRepo.viewAll(userId, userId),
      recipeRepo.viewAll(userId, userId),
      recipeRepo.viewAll(userId, 1),
      savedRecipeRepo.viewByUserId(userId)
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
