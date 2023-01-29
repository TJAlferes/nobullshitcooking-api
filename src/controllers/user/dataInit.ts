import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';

import { FavoriteRecipe, SavedRecipe, Friendship, Plan, Equipment, Ingredient, Recipe } from '../../access/mysql';

export class UserDataInitController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewInitialData = this.viewInitialData.bind(this);
  }

  async viewInitialData(req: Request, res: Response) {
    console.log('0---flag---');
    const userId = req.session.userInfo?.id;
    if (!userId) return res.end();
    console.log('1---flag---');

    const favoriteRecipe = new FavoriteRecipe(this.pool);
    const friendship =     new Friendship(this.pool);
    const plan =           new Plan(this.pool);
    const equipment =      new Equipment(this.pool);
    const ingredient =     new Ingredient(this.pool);
    const recipe =         new Recipe(this.pool);
    const savedRecipe =    new SavedRecipe(this.pool);

    const [ myFavoriteRecipes, myFriendships, myPlans, myPrivateEquipment, myPrivateIngredients, myPrivateRecipes, myPublicRecipes, mySavedRecipes ] = await Promise.all([
      favoriteRecipe.viewByUserId(userId),
      friendship.view(userId),
      plan.view(userId),
      equipment.view(userId, userId),
      ingredient.view(userId, userId),
      recipe.view(userId, userId),
      recipe.view(userId, 1),
      savedRecipe.viewByUserId(userId)
    ]);
    console.log('2---flag---');

    return res.send({myFavoriteRecipes, myFriendships, myPlans, myPrivateEquipment, myPrivateIngredients, myPrivateRecipes, myPublicRecipes, mySavedRecipes});
  }
}