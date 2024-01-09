import type { Request, Response } from 'express';

import { ImageRepo } from '../../image/repo';
import { Image } from '../../image/model';
import { UserImage } from './model';
import { UserImageRepo } from './repo';
import { UserRepo } from '../repo';
import { ForbiddenException, NotFoundException } from '../../../utils/exceptions';

export const userImageController = {
  async viewCurrent(req: Request, res: Response) {
    const { username } = req.params;

    const userRepo = new UserRepo();
    const user = await userRepo.getByUsername(username);
    if (!user) throw new NotFoundException();

    const userImageRepo = new UserImageRepo();
    const row = await userImageRepo.viewCurrent(user.user_id);

    return res.status(200).json(row);
  },

  async viewAll(req: Request, res: Response) {
    const { username } = req.params;
    const user_id = req.session.user_id!;

    const userRepo = new UserRepo();
    const user = await userRepo.getByUsername(username);
    if (!user) throw new NotFoundException();
    if (user_id !== user.user_id) throw new ForbiddenException();

    const userImageRepo = new UserImageRepo();
    const rows = await userImageRepo.viewAll(user_id);

    return res.status(200).json(rows);
  },

  async create(req: Request, res: Response) {
    const { new_avatar } = req.body;
    const user_id = req.session.user_id!;
  
    const image = Image.create({
      author_id:      user_id,
      owner_id:       user_id,  // ?
      image_filename: new_avatar,
      caption:        ''
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
    await userImageRepo.setCurrent({user_id, image_id: image.image_id});  // eh...
  
    return res.status(204).json();
  },

  async setCurrent(req: Request, res: Response) {
    const { image_id } = req.params;
    const user_id = req.session.user_id!;

    const userImageRepo = new UserImageRepo();
    await userImageRepo.setCurrent({user_id, image_id});
  
    return res.status(204).json();
  },

  async delete(req: Request, res: Response) {
    const { username, image_id } = req.params;
    const user_id = req.session.user_id!;

    const userRepo = new UserRepo();
    const user = await userRepo.getByUsername(username);
    if (!user) throw new NotFoundException();
    if (user_id !== user.user_id) throw new ForbiddenException();

    const imageRepo = new ImageRepo();
    const image = await imageRepo.viewOne(image_id);
    if (!image) throw new NotFoundException();
    if (image.owner_id !== user_id) throw new ForbiddenException();

    await imageRepo.deleteOne({owner_id: user_id, image_id});
  
    return res.status(204).json();
  }
};
