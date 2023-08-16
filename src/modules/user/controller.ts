import { Request, Response } from 'express';

import { UserService } from './service';
import { UserRepo }    from './repo';

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
    const user_id = req.session.userInfo!.user_id;  // res.locals? either way, clean up

    const userRepo    = new UserRepo();
    const userService = new UserService(userRepo);
    await userService.update({user_id, email, password, username, confirmation_code});

    return res.send({message: 'User account updated.'});
  }

  async delete(req: Request, res: Response) {
    const user_id = req.session.userInfo!.user_id;

    const userRepo    = new UserRepo();
    const userService = new UserService(userRepo);
    await userService.delete(user_id);

    return res.send({message: 'User account deleted.'});
  }
}
