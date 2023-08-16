import { Request, Response } from 'express';

import { UserAuthenticationService } from '../../../app/services';
import { io }                        from '../../../index';
import { UserRepo }                  from '../../repos/mysql';

export class UserAuthenticationController {
  async login(req: Request, res: Response) {
    const loggedIn = req.session.userInfo?.id;
    if (loggedIn) {
      return res.json({message: 'Already logged in.'});  // throw in this layer?
    }
    
    const { email, password } = req.body.userInfo;

    const userRepo                  = new UserRepo();
    const userAuthenticationService = new UserAuthenticationService(userRepo);

    const username = await userAuthenticationService.login({email, password, session: req.session});

    return res.json({message: 'Logged in.', username});
  }

  async logout(req: Request, res: Response) {
    const sessionId = req.session.id;

    req.session!.destroy(function() {
      io.in(sessionId).disconnectSockets();
      res.status(204);
    });

    return res.end();
  }
}
