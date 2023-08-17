import { Request, Response } from 'express';

import { UserConfirmationService } from './service';
import { UserRepo }                from '../repo';

export class UserConfirmationController {
  async confirm(req: Request, res: Response) {
    const { confirmation_code } = req.body.userInfo;

    const userRepo                = new UserRepo();
    const userConfirmationService = new UserConfirmationService(userRepo);

    await userConfirmationService.confirm(confirmation_code);

    return res.send({message: 'User account confirmed.'});
  }

  async resendConfirmationCode(req: Request, res: Response) {
    const { email, password } = req.body.userInfo;

    const userRepo                = new UserRepo();
    const userConfirmationService = new UserConfirmationService(userRepo);

    await userConfirmationService.resendConfirmationCode({email, password});

    return res.send({message: 'Confirmation code re-sent.'});
  }
}
