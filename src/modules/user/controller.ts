import { Request, Response } from 'express';

import { UserService } from './service';
import { UserRepo }    from './repo';

export const userController = {
  async create(req: Request, res: Response) {
    const userRepo    = new UserRepo();
    const userService = new UserService(userRepo);
    await userService.create(req.body);

    return res.send({message: 'User account created.'});  // or .status and .json ???
  },
  
  async updateEmail(req: Request, res: Response) {
    const new_email = req.body.new_email;
    const user_id   = req.session.userInfo!.user_id;  // res.locals?

    const userRepo    = new UserRepo();
    const userService = new UserService(userRepo);
    await userService.updateEmail({user_id, new_email});

    return res.send({message: 'Email updated.'});
  },

  async updatePassword(req: Request, res: Response) {
    const new_password = req.body.new_password;
    const user_id      = req.session.userInfo!.user_id;  // res.locals?

    const userRepo    = new UserRepo();
    const userService = new UserService(userRepo);
    await userService.updatePassword({user_id, new_password});

    return res.send({message: 'Password updated.'});
  },

  async updateUsername(req: Request, res: Response) {
    const new_username = req.body.new_username;
    const user_id      = req.session.userInfo!.user_id;  // res.locals?

    const userRepo    = new UserRepo();
    const userService = new UserService(userRepo);
    await userService.updateUsername({user_id, new_username});

    return res.send({message: 'Username updated.'});
  },

  async delete(req: Request, res: Response) {
    const user_id = req.session.userInfo!.user_id;

    const userRepo    = new UserRepo();
    const userService = new UserService(userRepo);
    await userService.delete(user_id);

    return res.send({message: 'User account deleted.'});
  }
};
