import type { Request, Response } from 'express';

import { ImageRepo }     from '../../image/repo.js';
import { Image }         from '../../image/model.js';
import { UserImage }     from './model.js';
import { UserImageRepo } from './repo.js';

export const userImageController = {
  async viewAll(req: Request, res: Response) {
    const user_id = req.session.user_id!;

    const userImageRepo = new UserImageRepo();
    const rows = await userImageRepo.viewAll(user_id);

    return res.json(rows);
  },

  async viewCurrent(req: Request, res: Response) {
    const user_id = req.session.user_id!;

    const userImageRepo = new UserImageRepo();
    const row = await userImageRepo.viewCurrent(user_id);

    return res.json(row);
  },

  async create(req: Request, res: Response) {
    const new_avatar = req.body.new_avatar;
    const user_id    = req.session.user_id!;
  
    const image = Image.create({
      author_id:      user_id,
      owner_id:       user_id,
      image_filename: new_avatar,
      caption:        ""
    }).getDTO();
    const imageRepo = new ImageRepo();
    await imageRepo.insert(image);

    const userImage = UserImage.create({
      user_id,
      image_id: image.image_id,
      current:  false
    }).getDTO();
    const userImageRepo = new UserImageRepo();
    await userImageRepo.insert(userImage);
  
    return res.status(204);
  },

  async setCurrent(req: Request, res: Response) {
    const { image_id } = req.params;
    const user_id      = req.session.user_id!;

    const userImageRepo = new UserImageRepo();
    await userImageRepo.setCurrent({user_id, image_id});
  
    return res.status(204);
  },

  async delete(req: Request, res: Response) {
    const { image_id } = req.params;
    const owner_id     = req.session.user_id!;

    const imageRepo = new ImageRepo();
    await imageRepo.deleteOne({owner_id, image_id});
  
    return res.status(204);
  }
};
