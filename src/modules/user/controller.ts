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
    const { new_email, password } = req.body;
    const user_id       = req.session.user_id!;

    const userRepo    = new UserRepo();
    const userService = new UserService(userRepo);
    await userService.updateEmail({user_id, new_email, password});

    return res.status(204).json();
  },

  async updatePassword(req: Request, res: Response) {
    const { new_password, current_password } = req.body;
    const user_id          = req.session.user_id!;

    const userRepo    = new UserRepo();
    const userService = new UserService(userRepo);
    await userService.updatePassword({user_id, new_password, current_password});

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
    const { password } = req.body;
    const user_id = req.session.user_id!;

    const userRepo    = new UserRepo();
    const userService = new UserService(userRepo);
    await userService.delete({user_id, password});

    return res.status(204).json();
  }
};
