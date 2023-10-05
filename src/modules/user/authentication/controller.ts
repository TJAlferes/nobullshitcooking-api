import { Request, Response } from 'express';

import { socketIOServer }            from '../../..';
import { NOBSC_USER_ID }             from '../../shared/model';
import { ChatgroupRepo }             from '../../chat/group/repo';
import { EquipmentRepo }             from '../../equipment/repo';
import { IngredientRepo }            from '../../ingredient/repo';
import { PlanRepo }                  from '../../plan/repo';
import { RecipeRepo }                from '../../recipe/repo';
import { FriendshipRepo }            from '../friendship/repo';
import { FavoriteRecipeRepo }        from '../favorite-recipe/repo';
import { SavedRecipeRepo }           from '../saved-recipe/repo';
import { UserRepo }                  from '../repo';
import { UserAuthenticationService } from './service';

export const userAuthenticationController = {
  async confirm(req: Request, res: Response) {
    const { confirmation_code } = req.body;

    const repo    = new UserRepo();
    const service = new UserAuthenticationService(repo);

    await service.confirm(confirmation_code);

    return res.status(204);
  },

  async resendConfirmationCode(req: Request, res: Response) {
    const { email, password } = req.body;

    const repo    = new UserRepo();
    const service = new UserAuthenticationService(repo);

    await service.resendConfirmationCode({email, password});

    return res.status(204);
  },

  async login(req: Request, res: Response) {
    const loggedIn = req.session.user_id!;
    if (loggedIn) {
      return res.json({message: 'Already logged in.'});
    }
    
    const { email, password } = req.body;

    const repo    = new UserRepo();
    const service = new UserAuthenticationService(repo);

    const { user_id, username } = await service.login({
      email,
      password,
      session: req.session
    });

    // get initial user data

    const friendshipRepo     = new FriendshipRepo();
    const equipmentRepo      = new EquipmentRepo();
    const ingredientRepo     = new IngredientRepo();
    const planRepo           = new PlanRepo();
    const recipeRepo         = new RecipeRepo();
    const savedRecipeRepo    = new SavedRecipeRepo();
    const favoriteRecipeRepo = new FavoriteRecipeRepo();
    const chatgroupRepo      = new ChatgroupRepo();

    const [
      my_friendships,
      my_public_plans,
      my_public_recipes,
      my_favorite_recipes,
      my_private_equipment,
      my_private_ingredients,
      my_private_plans,
      my_private_recipes,
      my_saved_recipes,
      my_chatgroups
    ] = await Promise.all([
      friendshipRepo.viewAll(user_id),
      planRepo.overviewAll({
        author_id: user_id,
        owner_id:  NOBSC_USER_ID
      }),
      recipeRepo.overviewAll({
        author_id: user_id,
        owner_id:  NOBSC_USER_ID
      }),
      favoriteRecipeRepo.viewByUserId(user_id),
      equipmentRepo.viewAll(user_id),
      ingredientRepo.viewAll(user_id),
      planRepo.overviewAll({
        author_id: user_id,
        owner_id:  user_id
      }),
      recipeRepo.overviewAll({
        author_id: user_id,
        owner_id:  user_id
      }),
      savedRecipeRepo.viewByUserId(user_id),
      chatgroupRepo.viewAll(user_id)
    ]);

    return res.json({
      message: 'Logged in.',
      auth_id: user_id,
      auth_email: email,
      authname: username,
      my_friendships,
      my_public_plans,
      my_public_recipes,
      my_favorite_recipes,
      my_private_equipment,
      my_private_ingredients,
      my_private_plans,
      my_private_recipes,
      my_saved_recipes,
      my_chatgroups
    });
  },

  async logout(req: Request, res: Response) {
    const session_id = req.session.id;

    req.session!.destroy(() => {
      // disconnect all Socket.IO connections linked to this session ID
      socketIOServer.in(session_id).disconnectSockets();
      res.status(204).end();
    });

    return res.end();
  }
};
