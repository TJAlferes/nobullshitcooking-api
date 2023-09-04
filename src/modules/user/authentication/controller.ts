import { Request, Response } from 'express';

import { io }                        from '../../../index';
import { UserRepo }                  from '../repo';
import { UserAuthenticationService } from './service';

export const userAuthenticationController = {
  async login(req: Request, res: Response) {
    const loggedIn = req.session.userInfo?.user_id;
    if (loggedIn) {
      return res.json({message: 'Already logged in.'});  // throw in this layer?
    }
    
    const { email, password } = req.body;

    const repo = new UserRepo();
    const { login } = new UserAuthenticationService(repo);

    const username = await login({
      email,
      password,
      session: req.session
    });

    return res.json({message: 'Logged in.', username});
  },

  async logout(req: Request, res: Response) {
    const sessionId = req.session.id;

    req.session!.destroy(function() {
      io.in(sessionId).disconnectSockets();
      res.status(204);
    });

    return res.end();
  }
};
