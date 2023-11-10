import type { Request, Response } from 'express';
import { uuidv7 }                 from 'uuidv7';

import { NotFoundException }         from '../../../utils/exceptions.js';
import { socketIOServer }            from '../../../index.js';
import { NOBSC_USER_ID }             from '../../shared/model.js';
//import { ChatgroupRepo }             from '../../chat/group/repo.js';
import { EquipmentRepo }             from '../../equipment/repo.js';
import { IngredientRepo }            from '../../ingredient/repo.js';
import { PlanRepo }                  from '../../plan/repo.js';
import { RecipeRepo }                from '../../recipe/repo.js';
import { FriendshipRepo }            from '../friendship/repo.js';
import { UserImageRepo }             from '../image/repo.js';
import { FavoriteRecipeRepo }        from '../favorite-recipe/repo.js';
import { SavedRecipeRepo }           from '../saved-recipe/repo.js';
import { UserRepo }                  from '../repo.js';
import { UserService }               from '../service.js';
import { UserAuthenticationService } from './service.js';
import { PasswordReset }             from './password-reset/model.js';
import { PasswordResetRepo }         from './password-reset/repo.js';
import { PasswordResetService }      from './password-reset/service.js';

export const userAuthenticationController = {
  async resendConfirmationCode(req: Request, res: Response) {
    const { email, password } = req.body;

    const repo    = new UserRepo();
    const service = new UserAuthenticationService(repo);

    await service.resendConfirmationCode({email, password});

    return res.status(204);
  },

  async confirm(req: Request, res: Response) {
    const { confirmation_code } = req.body;

    const repo    = new UserRepo();
    const service = new UserAuthenticationService(repo);

    await service.confirm(confirmation_code);

    return res.status(204);
  },

  async login(req: Request, res: Response) {
    const loggedIn = req.session.user_id;
    if (loggedIn) return res.status(409);
    
    const { email, password } = req.body;

    const repo    = new UserRepo();
    const service = new UserAuthenticationService(repo);

    const { user_id, username } = await service.login({email, password});

    // get initial user data

    const userImageRepo      = new UserImageRepo();
    const friendshipRepo     = new FriendshipRepo();
    const equipmentRepo      = new EquipmentRepo();
    const ingredientRepo     = new IngredientRepo();
    const planRepo           = new PlanRepo();
    const recipeRepo         = new RecipeRepo();
    const savedRecipeRepo    = new SavedRecipeRepo();
    const favoriteRecipeRepo = new FavoriteRecipeRepo();
    //const chatgroupRepo      = new ChatgroupRepo();

    const [
      my_avatar,
      my_friendships,
      my_public_plans,
      my_public_recipes,
      my_favorite_recipes,
      my_private_equipment,
      my_private_ingredients,
      my_private_plans,
      my_private_recipes,
      my_saved_recipes,
      //my_chatgroups
    ] = await Promise.all([
      userImageRepo.viewCurrent(user_id),
      friendshipRepo.viewAll(user_id),
      planRepo.viewAll({
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
      planRepo.viewAll({
        author_id: user_id,
        owner_id:  user_id
      }),
      recipeRepo.overviewAll({
        author_id: user_id,
        owner_id:  user_id
      }),
      savedRecipeRepo.viewByUserId(user_id),
      //chatgroupRepo.viewAll(user_id)
    ]);

    req.session.user_id  = user_id;
    req.session.username = username;

    return res.status(201).json({
      auth_id: user_id,
      auth_email: email,
      authname: username,
      auth_avatar: my_avatar?.image_filename,
      my_friendships,
      my_public_plans,
      my_public_recipes,
      my_favorite_recipes,
      my_private_equipment,
      my_private_ingredients,
      my_private_plans,
      my_private_recipes,
      my_saved_recipes,
      //my_chatgroups: []
    });
  },

  async logout(req: Request, res: Response) {
    const session_id = req.session.user_id!;

    req.session!.destroy(() => {
      // disconnect all Socket.IO connections linked to this session ID
      socketIOServer.in(session_id).disconnectSockets();
      res.status(204).end();
    });

    return res.end();
  },

  async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;

    const userRepo = new UserRepo();
    const user = await userRepo.getByEmail(email);
    if (!user) throw NotFoundException();

    const { hashPassword } = new UserAuthenticationService(userRepo);
    const temporary_password = uuidv7();
    const encryptedPassword = await hashPassword(temporary_password);
    const passwordReset = PasswordReset.create({
      user_id: user.user_id,
      temporary_password: encryptedPassword
    }).getDTO();

    const passwordResetRepo = new PasswordResetRepo();
    const { sendTemporaryPassword } = new PasswordResetService(passwordResetRepo);
    await passwordResetRepo.insert(passwordReset);

    await sendTemporaryPassword({email, temporary_password});

    return res.status(201);
  },

  async resetPassword(req: Request, res: Response) {
    const { email, temporary_password, new_password } = req.body;

    const userRepo = new UserRepo();
    const user = await userRepo.getByEmail(email);
    if (!user) throw NotFoundException();

    const passwordResetRepo = new PasswordResetRepo();
    const passwordResetService = new PasswordResetService(passwordResetRepo);
    await passwordResetService.isCorrectTemporaryPassword({
      user_id: user.user_id,
      temporary_password
    });

    const userService = new UserService(userRepo);
    await userService.updatePassword({
      user_id: user.user_id,
      new_password
    });

    await passwordResetRepo.deleteByUserId(user.user_id);

    return res.status(204);
  }
};
