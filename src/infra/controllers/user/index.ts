import { Request, Response } from 'express';

import { UserService } from '../../../app/services';
import { UserRepo }    from '../../repos/mysql';

export class UserController {
  async create(req: Request, res: Response) {
    const { email, password, username } = req.body.userInfo;

    const userRepo    = new UserRepo();
    const userService = new UserService(userRepo);
    await userService.create({email, password, username});  // return message from here???

    return res.send({message: 'User account created.'});  // or .status and .json ???
  }
  
  async update(req: Request, res: Response) {
    const { email, password, username, confirmation_code } = req.body.userInfo;
    const id = req.session.userInfo!.id;

    const userRepo    = new UserRepo();
    const userService = new UserService(userRepo);
    await userService.update({id, email, password, username, confirmation_code});

    return res.send({message: 'Account updated.'});
  }

  async delete(req: Request, res: Response) {
    const id = req.session.userInfo!.id;

    const userRepo    = new UserRepo();
    const userService = new UserService(userRepo);
    await userService.delete(id);

    return res.send({message: 'Account deleted.'});
  }
}

export { UserAuthenticationController } from './authentication';
export { UserConfirmationController }   from './confirmation';
export { UserDataInitController }       from './dataInit';
export { UserFavoriteRecipeController } from './favoriteRecipe';
export { UserFriendshipController }     from './friendship';
export { UserPublicPlanController }     from './plan';
export { UserPublicRecipeController }   from './recipe';
export { UserSignedUrlController }      from './signed-url';
