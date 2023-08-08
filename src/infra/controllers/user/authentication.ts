import { Request, Response } from 'express';

import { UserAuthenticationService } from '../../../app/services';
import { io }                        from '../../../index';
import { UserRepo }                  from '../../repos/mysql';

export class UserAuthenticationController {
  async login(req: Request, res: Response) {
    const loggedIn = req.session.userInfo?.id;
    if (loggedIn) {
      return res.json({message: 'Already logged in.'});  // throw in this layer?  // do this inside the service ?
    }
    
    const { email, password } = req.body.userInfo;

    const userRepo                  = new UserRepo();
    const userAuthenticationService = new UserAuthenticationService(userRepo);

    const { id, username } = await userAuthenticationService.login({email, password});

    req.session.userInfo = {id, username};  // do this inside the service ?

    return res.json({message: 'Signed in.', username});
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
