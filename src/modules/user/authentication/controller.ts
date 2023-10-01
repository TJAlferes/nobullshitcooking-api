import { Request, Response } from 'express';

import { socketIOServer }            from '../../..';
import { UserRepo }                  from '../repo';
import { UserAuthenticationService } from './service';

export const userAuthenticationController = {
  async confirm(req: Request, res: Response) {
    const { confirmation_code } = req.body;

    const repo    = new UserRepo();
    const service = new UserAuthenticationService(repo);

    await service.confirm(confirmation_code);

    return res.send({message: 'User account confirmed.'});
  },

  async resendConfirmationCode(req: Request, res: Response) {
    const { email, password } = req.body;

    const repo    = new UserRepo();
    const service = new UserAuthenticationService(repo);

    await service.resendConfirmationCode({email, password});

    return res.send({message: 'Confirmation code re-sent.'});
  },

  async login(req: Request, res: Response) {
    const loggedIn = req.session.user_id!;
    if (loggedIn) {
      return res.json({message: 'Already logged in.'});
    }
    
    const { email, password } = req.body;

    const repo    = new UserRepo();
    const service = new UserAuthenticationService(repo);

    const username = await service.login({
      email,
      password,
      session: req.session
    });

    return res.json({message: 'Logged in.', username});
  },

  async logout(req: Request, res: Response) {
    const session_id = req.session.id;

    req.session!.destroy(() => {
      // disconnect all Socket.IO connections linked to this session ID
      socketIOServer.in(session_id).disconnectSockets();
      res.status(204).end();
    });

    return res.end();
  }
};
