import type { Request, Response } from 'express';

import { UserRepo } from './repo';
import { UserService } from './service';

export const userController = {
  async create(req: Request, res: Response) {
    const userRepo    = new UserRepo();
    const userService = new UserService(userRepo);
    await userService.create(req.body);

    return res.status(201).json();
  },
  
  async updateEmail(req: Request, res: Response) {
    const { new_email } = req.body;
    const user_id       = req.session.user_id!;

    const userRepo    = new UserRepo();
    const userService = new UserService(userRepo);
    await userService.updateEmail({user_id, new_email});

    return res.status(204).json();
  },

  async updatePassword(req: Request, res: Response) {
    const { new_password } = req.body;
    const user_id          = req.session.user_id!;

    const userRepo    = new UserRepo();
    const userService = new UserService(userRepo);
    await userService.updatePassword({user_id, new_password});

    return res.status(204).json();
  },

  async updateUsername(req: Request, res: Response) {
    const { new_username } = req.body;
    const user_id          = req.session.user_id!;

    const userRepo    = new UserRepo();
    const userService = new UserService(userRepo);
    await userService.updateUsername({user_id, new_username});

    return res.status(204).json();
  },

  async delete(req: Request, res: Response) {
    const user_id = req.session.user_id!;

    const userRepo    = new UserRepo();
    const userService = new UserService(userRepo);
    await userService.delete(user_id);

    return res.status(204).json();
  }
};
