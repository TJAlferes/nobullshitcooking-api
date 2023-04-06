import { Request, Response } from 'express';
import { Pool }              from 'mysql2/promise';

import { FavoriteRecipe, SavedRecipe, Friendship, Plan, Equipment, Ingredient, Recipe } from '../../access/mysql';

export class UserDataInitController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }
  
  async viewInitialUserData(req: Request, res: Response) {
    const userId = req.session.userInfo!.id;

    const favoriteRecipe = new FavoriteRecipe(this.pool);
    const friendship =     new Friendship(this.pool);
    const plan =           new Plan(this.pool);
    const equipment =      new Equipment(this.pool);
    const ingredient =     new Ingredient(this.pool);
    const recipe =         new Recipe(this.pool);
    const savedRecipe =    new SavedRecipe(this.pool);

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
      favoriteRecipe.viewByUserId(userId),
      friendship.view(userId),
      plan.viewAll(userId),
      equipment.viewAll(userId, userId),
      ingredient.viewAll(userId, userId),
      recipe.viewAll(userId, userId),
      recipe.viewAll(userId, 1),
      savedRecipe.viewByUserId(userId)
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
