import { Request, Response } from 'express';

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
  
  async update(req: Request, res: Response) {
    const { email, password, username, confirmation_code } = req.body.userInfo;
    const id = req.session.userInfo!.id;

    const repo = new UserRepo();
    const userService = new UserService(repo);
    await userService.update({id, email, password, username, confirmation_code});

    return res.send({message: 'Account updated.'});
  }

  async delete(req: Request, res: Response) {
    const userId = req.session.userInfo!.id;

    const repo = new UserRepo();
    const userService = new UserService(repo);
    await userService.delete(userId);

    return res.send({message: 'Account deleted.'});
  }
}
