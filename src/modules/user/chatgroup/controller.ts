/*import type { Request, Response } from 'express';

import { Chatgroup }     from '../../chat/group/model';
import { ChatgroupRepo } from '../../chat/group/repo';

export const chatgroupController = {
  async viewOne() {
    const repo = new ChatgroupRepo();
    const row = await repo.viewOne(chatgroup_id);
    
  },

  async create(req: Request, res: Response) {
    const chatgroup_name = req.body;
    const owner_id = req.session.user_id!;

    const repo = new ChatgroupRepo();
    const chatgroup = Chatgroup.create({owner_id, chatgroup_name}).getDTO();
    await repo.insert(chatgroup);

    return res.status(201).json({message: 'Chatgroup created.'});
  },

  async update() {

  },

  async delete() {

  }
};
*/