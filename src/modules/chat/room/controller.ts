import type { Request, Response } from 'express';

import { ChatgroupRepo } from '../group/repo';
import { Chatroom } from './model';
import { ChatroomRepo } from './repo';

export const chatroomController = {
  async create(req: Request, res: Response) {
    const { chatgroup_id, chatroom_name } = req.body;
    const user_id = req.session.user_id!;

    const chatgroupRepo = new ChatgroupRepo();
    const owner_id = await chatgroupRepo.getOwnerId(chatgroup_id);
    if (user_id !== owner_id) {
      return res.status(403).end();
    }

    const chatroom = Chatroom.create({chatgroup_id, chatroom_name}).getDTO();
    const chatroomRepo = new ChatroomRepo();
    await chatroomRepo.insert(chatroom);
  },

  async delete(req: Request, res: Response) {
    const { chatgroup_id, chatroom_id } = req.body;
    const user_id = req.session.user_id!;

    const chatgroupRepo = new ChatgroupRepo();
    const owner_id = await chatgroupRepo.getOwnerId(chatgroup_id);
    if (user_id !== owner_id) {
      return res.status(403).end();
    }

    const chatroomRepo = new ChatroomRepo();
    await chatroomRepo.deleteOne(chatroom_id);
  }
};
