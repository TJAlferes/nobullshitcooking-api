import type { Request, Response } from 'express';

import { ChatgroupUser }     from './model';
import { ChatgroupUserRepo } from './repo';
import { ChatgroupRepo }     from "../repo";

export const chatgroupUserController = {
  viewAll(req: Request, res: Response) {

  },

  join(req: Request, res: Response) {
    const 
    const user_id = req.session.user_id!;

    const chatgroupUserRepo = new ChatgroupUserRepo();
    await chatgroupUserRepo.insert();

    //return res.
  },

  leave(req: Request, res: Response) {
    const user_id = req.session.user_id!;

    const chatgroupUserRepo = new ChatgroupUserRepo();
    // check they're not leaving a chatgroup they own
    // (they must first give another user ownership)
    await chatgroupUserRepo.deleteByUserId(user_id);

    //return res.
  },

  ban(req: Request, res: Response) {
    const { chatgroup_id, user_id } = req.body;
    const owner_id = req.session.user_id!;

    // check they're actually the chatgroup owner:
    const chatgroupRepo = new ChatgroupRepo();
    const chatgroup = await chatgroupRepo.viewOne({owner_id, chatgroup_id});
    // check they're not banning themselves:
    if (owner_id === chatgroup.owner_id) {
      return res.status().json({message: ""});
    }

    const chatgroupUserRepo = new ChatgroupUserRepo();
    await chatgroupUserRepo.deleteByUserId(user_id);

    //return res.
  }
};

socket.on('joinChatgroup', async () => {
  await joinChatgroup();
});

socket.on('leaveChatgroup', async () => {
  await leaveChatGroup();
});

// TO DO: make invite codes easy to generate, make them expire in 1 day
// TO DO: make chatgroup owners able to decline all current pending invite requests, not just 1 at a time
// TO DO: make chatgroup owners able to toggle the chatroom "invisible" when needed

socket.on('banUserFromChatgroup', async () => {
  await banUserFromChatgroup();
});
