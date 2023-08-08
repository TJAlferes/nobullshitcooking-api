import bcrypt                from 'bcrypt';
import { Request, Response } from 'express';
import { assert }            from 'superstruct';

import { UserService } from '../../../app/services';
import {
  UserRepo,
  FriendshipRepo,
  PlanRepo,
  EquipmentRepo,
  IngredientRepo,
  RecipeRepo,
  RecipeEquipmentRepo,
  RecipeIngredientRepo,
  RecipeMethodRepo,
  RecipeSubrecipeRepo,
  FavoriteRecipeRepo,
  SavedRecipeRepo
} from '../../repos/mysql';

export { UserAuthenticationController } from './authentication';
export { UserConfirmationController }   from './confirmation';
export { UserDataInitController }       from './dataInit';
export { UserFavoriteRecipeController } from './favoriteRecipe';
export { UserFriendshipController }     from './friendship';
export { UserPublicPlanController }     from './plan';
export { UserPublicRecipeController }   from './recipe';
export { UserSignedUrlController }      from './signed-url';

export class UserController {
  // move this to a UserController and rename it to create ???
  async create(req: Request, res: Response) {
    const { email, password, username } = req.body.userInfo;

    const repo        = new UserRepo();
    const userService = new UserService(repo);
    await userService.create({email, password, username});  // return message from here???

    return res.send({message: 'User account created.'});  // or .status and .json ???
  }
  
  async update(req: Request, res: Response) {  // TO DO: move most into userService.update
    const { email, password, username } = req.body.userInfo;
    const id = req.session.userInfo!.id;
    
    if (id === 1) return res.end();  // IMPORTANT: Do not allow user 1, NOBSC, to be changed.  (THIS IS A BUSINESS RULE, move this BUSINESS LOGIC TO THE DOMAIN MODEL)

    const encryptedPass = await bcrypt.hash(password, 10);
    const args = {email, pass: encryptedPass, username};
    assert(args, validUpdatingUser);

    const userRepo = new UserRepo();
    await userRepo.update({id, ...args});

    return res.send({message: 'Account updated.'});
  }

  async delete(req: Request, res: Response) {  // TO DO: move most into userService.delete
    const userId = req.session.userInfo!.id;

    if (userId === 1) return res.end();  // IMPORTANT: Never allow user 1, NOBSC, to be deleted.

    const equipmentRepo =        new EquipmentRepo();
    const favoriteRecipeRepo =   new FavoriteRecipeRepo();
    const friendshipRepo =       new FriendshipRepo();
    const ingredientRepo =       new IngredientRepo();
    const planRepo =             new PlanRepo();
    const recipeRepo =           new RecipeRepo();
    const recipeEquipmentRepo =  new RecipeEquipmentRepo();
    const recipeIngredientRepo = new RecipeIngredientRepo();
    const recipeMethodRepo =     new RecipeMethodRepo();
    const recipeSubrecipeRepo =  new RecipeSubrecipeRepo();
    const savedRecipeRepo =      new SavedRecipeRepo();
    const userRepo =             new UserRepo();

    // NOTE: Due to foreign key constraints, deletes must be in this order. (Do this in MySQL instead?) (WHAT!?)

    // First delete/disown the user's relationships and content...
    await Promise.all([
      friendshipRepo.deleteAllByUserId(userId),
      planRepo.deleteAll(userId),
      favoriteRecipeRepo.deleteAllByUserId(userId),
      savedRecipeRepo.deleteAllByUserId(userId)
    ]);
    await recipeRepo.disownAllByAuthorId(userId);
    const recipeIds = await recipeRepo.getPrivateIds(userId);  // CAREFUL! Double check this.
    await Promise.all([
      recipeEquipmentRepo.deleteByRecipeIds(recipeIds),
      recipeIngredientRepo.deleteByRecipeIds(recipeIds),
      recipeMethodRepo.deleteByRecipeIds(recipeIds),
      recipeSubrecipeRepo.deleteByRecipeIds(recipeIds),
      recipeSubrecipeRepo.deleteBySubrecipeIds(recipeIds)
    ]);
    await recipeRepo.deleteAllByOwnerId(userId);  // CAREFUL! Double check this.
    await Promise.all([equipmentRepo.deleteAll(userId), ingredientRepo.deleteAll(userId)]);

    // ... Then delete the user.
    await userRepo.deleteById(userId);

    return res.send({message: 'Account deleted.'});
  }
}
