import type { Request, Response } from 'express';

import { ForbiddenException, NotFoundException } from '../../../utils/exceptions';
import { UserRepo } from '../repo';
import { Friendship } from './model';
import { FriendshipRepo } from './repo';

export const friendshipController = {
  async viewAll(req: Request, res: Response) {
    const user_id = req.session.user_id!;

    const friendshipRepo = new FriendshipRepo();
    const friendships = await friendshipRepo.viewAll(user_id);

    return res.status(200).json(friendships);
  },

  async create(req: Request, res: Response) {
    const { friendname } = req.params;

    const userRepo = new UserRepo();
    const friend = await userRepo.getByUsername(friendname);
    //if (!friend) throw new Error('This line works, but the next line does not.');
    if (!friend) throw new NotFoundException('TEST');

    const user_id   = req.session.user_id!;
    const friend_id = friend.user_id;

    const friendshipRepo = new FriendshipRepo();
    const status = await friendshipRepo.getStatus({user_id: friend_id, friend_id: user_id});
    if (status === 'blocked') throw new NotFoundException();

    const currentStatus = await friendshipRepo.getStatus({user_id, friend_id});
    if (!currentStatus) {
      const friendship1 = Friendship
        .create({
          user_id,
          friend_id,
          status: 'pending-sent'
        })
        .getDTO();

      const friendship2 = Friendship
        .create({
          user_id:   friend_id,
          friend_id: user_id,
          status:    'pending-received'
        })
        .getDTO();

      await friendshipRepo.insert(friendship1);
      await friendshipRepo.insert(friendship2);

      return res.status(201);
    }
    if ( currentStatus === 'pending-sent'
      || currentStatus === 'pending-received'
    ) {
      throw ForbiddenException('Already pending.');
    }
    if (currentStatus === 'accepted') {
      throw ForbiddenException('Already friends.');
    }
    if (currentStatus === 'blocked') {
      throw ForbiddenException('User blocked. First unblock.');
    }
  },

  async accept(req: Request, res: Response) {
    const { friendname } = req.params;

    const userRepo = new UserRepo();
    const friend = await userRepo.getByUsername(friendname);
    if (!friend) throw new NotFoundException();

    const user_id   = req.session.user_id!;
    const friend_id = friend.user_id;

    const friendshipRepo = new FriendshipRepo();
    const status = await friendshipRepo.getStatus({user_id, friend_id});
    if (status !== 'pending-received') throw ForbiddenException();

    await friendshipRepo.update({user_id, friend_id, status: 'accepted'});
    await friendshipRepo.update({friend_id, user_id, status: 'accepted'});

    return res.status(204);
  },

  async reject(req: Request, res: Response) {
    const { friendname } = req.params;

    const userRepo = new UserRepo();
    const friend = await userRepo.getByUsername(friendname);
    if (!friend) throw new NotFoundException();

    const user_id   = req.session.user_id!;
    const friend_id = friend.user_id;

    const friendshipRepo = new FriendshipRepo();
    const status = await friendshipRepo.getStatus({user_id, friend_id});
    if (status !== 'pending-received') throw ForbiddenException();

    await friendshipRepo.delete({user_id, friend_id});
    await friendshipRepo.delete({friend_id, user_id});

    return res.status(204);
  },

  async delete(req: Request, res: Response) {
    const { friendname } = req.params;

    const userRepo = new UserRepo();
    const friend = await userRepo.getByUsername(friendname);
    if (!friend) throw new NotFoundException();

    const user_id   = req.session.user_id!;
    const friend_id = friend.user_id;

    const friendshipRepo = new FriendshipRepo();
    const status = await friendshipRepo.getStatus({user_id, friend_id});
    if (status !== 'accepted') throw ForbiddenException();

    await friendshipRepo.delete({user_id, friend_id});
    await friendshipRepo.delete({friend_id, user_id});

    return res.status(204);
  },

  async block(req: Request, res: Response) {
    const { friendname } = req.params;

    const userRepo = new UserRepo();
    const friend = await userRepo.getByUsername(friendname);
    if (!friend) throw new NotFoundException();

    const user_id   = req.session.user_id!;
    const friend_id = friend.user_id;

    const friendshipRepo = new FriendshipRepo();

    await friendshipRepo.delete({user_id, friend_id});

    // This check prevents user_id from illegally getting unblocked by friend_id.
    // If friend_id has already blocked user_id, leave it be, don't delete that
    // otherwise delete the friendship.
    const status = await friendshipRepo.getStatus({user_id: friend_id, friend_id: user_id});
    if (status !== 'blocked') {
      await friendshipRepo.delete({friend_id, user_id});
    }

    // to clarify what's going on here:
    // user_id    is blocking          friend_id
    // friend_id  is being blocked by  user_id
    await friendshipRepo.insert({user_id, friend_id, status: 'blocked'});

    return res.status(204);
  },

  async unblock(req: Request, res: Response) {
    const { friendname } = req.params;

    const userRepo = new UserRepo();
    const friend = await userRepo.getByUsername(friendname);
    if (!friend) throw new NotFoundException();

    const user_id   = req.session.user_id!;
    const friend_id = friend.user_id;

    const friendshipRepo = new FriendshipRepo();
    const status = await friendshipRepo.getStatus({user_id, friend_id});
    if (status !== 'blocked') throw ForbiddenException();

    await friendshipRepo.delete({user_id, friend_id});

    return res.status(204);
  }
};
