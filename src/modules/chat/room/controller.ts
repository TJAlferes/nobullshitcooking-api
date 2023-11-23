import type { Request, Response } from 'express';

import { ForbiddenException } from '../../../utils/exceptions';
import { ChatgroupRepo } from '../group/repo';
import { Chatroom } from './model';
import { ChatroomRepo } from './repo';

export const chatroomController = {
  async create(req: Request, res: Response) {
    const { chatgroup_id, chatroom_name } = req.body;
    const user_id = req.session.user_id!;

    const chatgroupRepo = new ChatgroupRepo();
    const owner_id = await chatgroupRepo.getOwnerId(chatgroup_id);
    if (user_id !== owner_id) throw new ForbiddenException();

    const chatroom = Chatroom.create({chatgroup_id, chatroom_name}).getDTO();
    const chatroomRepo = new ChatroomRepo();
    await chatroomRepo.insert(chatroom);
  },

  async delete(req: Request, res: Response) {
    const { chatgroup_id, chatroom_id } = req.body;
    const user_id = req.session.user_id!;

    const chatgroupRepo = new ChatgroupRepo();
    const owner_id = await chatgroupRepo.getOwnerId(chatgroup_id);
    if (user_id !== owner_id) throw new ForbiddenException();

    const chatroomRepo = new ChatroomRepo();
    await chatroomRepo.deleteOne(chatroom_id);
  }
};
