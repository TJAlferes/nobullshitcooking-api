import type { Request, Response } from 'express';

import { UserService } from './service';
import { UserRepo }    from './repo';

export const userController = {
  async create(req: Request, res: Response) {
    const userRepo    = new UserRepo();
    const userService = new UserService(userRepo);
    await userService.create(req.body);

    return res.status(201);
  },
  
  async updateEmail(req: Request, res: Response) {
    const new_email = req.body.new_email;
    const user_id   = req.session.user_id!;

    const userRepo    = new UserRepo();
    const userService = new UserService(userRepo);
    await userService.updateEmail({user_id, new_email});

    return res.status(204);
  },

  async updatePassword(req: Request, res: Response) {
    const new_password = req.body.new_password;
    const user_id      = req.session.user_id!;

    const userRepo    = new UserRepo();
    const userService = new UserService(userRepo);
    await userService.updatePassword({user_id, new_password});

    return res.status(204);
  },

  async updateUsername(req: Request, res: Response) {
    const new_username = req.body.new_username;
    const user_id      = req.session.user_id!;

    const userRepo    = new UserRepo();
    const userService = new UserService(userRepo);
    await userService.updateUsername({user_id, new_username});

    return res.status(204);
  },

  async delete(req: Request, res: Response) {
    const user_id = req.session.user_id!;

    const userRepo    = new UserRepo();
    const userService = new UserService(userRepo);
    await userService.delete(user_id);

    return res.status(204);
  }
};
