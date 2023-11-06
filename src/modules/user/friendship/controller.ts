import { Request, Response } from 'express';

import { ForbiddenException, NotFoundException } from '../../../utils/exceptions.js';
import { UserRepo }       from '../repo.js';
import { Friendship }     from './model.js';
import { FriendshipRepo } from './repo.js';

export const friendshipController = {
  async viewAll(req: Request, res: Response) {
    const user_id = req.session.user_id!;

    const friendshipRepo = new FriendshipRepo();
    const friendships = await friendshipRepo.viewAll(user_id);

    return res.status(200).json(friendships);
  },

  async create(req: Request, res: Response) {
    const { friendname } = req.body;

    const userRepo = new UserRepo();
    const friend = await userRepo.getByUsername(friendname);
    if (!friend) throw NotFoundException();

    const user_id   = req.session.user_id!;
    const friend_id = friend.user_id;

    // do others need this too? probably
    const friendshipRepo = new FriendshipRepo();
    const status = await friendshipRepo.getStatus({user_id: friend_id, friend_id: user_id});
    if (status === "blocked") throw NotFoundException();

    // do others need this too? probably
    const currentStatus = await friendshipRepo.getStatus({user_id, friend_id});
    if (!currentStatus) {
      const friendship1 = Friendship
        .create({
          user_id,
          friend_id,
          status: "pending-sent"
        })
        .getDTO();

      const friendship2 = Friendship
        .create({
          user_id:   friend_id,
          friend_id: user_id,
          status:    "pending-received"
        })
        .getDTO();

      await friendshipRepo.insert(friendship1);
      await friendshipRepo.insert(friendship2);

      return res.status(201);
    }
    if ( currentStatus === "pending-sent"
      || currentStatus === "pending-received"
    ) {
      throw ForbiddenException('Already pending.');
    }
    if (currentStatus === "accepted") {
      throw ForbiddenException('Already friends.');
    }
    if (currentStatus === "blocked") {
      throw ForbiddenException('User blocked. First unblock.');
    }
  },

  async accept(req: Request, res: Response) {
    const { friendname } = req.params;

    const userRepo = new UserRepo();
    const friend = await userRepo.getByUsername(friendname);
    if (!friend) throw NotFoundException();

    const user_id   = req.session.user_id!;
    const friend_id = friend.user_id;

    const friendshipRepo = new FriendshipRepo();
    const status = await friendshipRepo.getStatus({user_id, friend_id});
    if (status !== "pending-received") throw ForbiddenException();

    await friendshipRepo.update({user_id, friend_id, status: "accepted"});
    await friendshipRepo.update({friend_id, user_id, status: "accepted"});

    return res.status(204);
  },

  async reject(req: Request, res: Response) {
    const { friendname } = req.params;

    const userRepo = new UserRepo();
    const friend = await userRepo.getByUsername(friendname);
    if (!friend) throw NotFoundException();

    const user_id   = req.session.user_id!;
    const friend_id = friend.user_id;

    const friendshipRepo = new FriendshipRepo();
    const status = await friendshipRepo.getStatus({user_id, friend_id});
    if (status !== "pending-received") throw ForbiddenException();

    await friendshipRepo.delete({user_id, friend_id});
    await friendshipRepo.delete({friend_id, user_id});

    return res.status(204);
  },

  async delete(req: Request, res: Response) {
    const { friendname } = req.params;

    const userRepo = new UserRepo();
    const friend = await userRepo.getByUsername(friendname);
    if (!friend) throw NotFoundException();

    const user_id   = req.session.user_id!;
    const friend_id = friend.user_id;

    const friendshipRepo = new FriendshipRepo();
    const status = await friendshipRepo.getStatus({user_id, friend_id});
    if (status !== "accepted") throw ForbiddenException();

    await friendshipRepo.delete({user_id, friend_id});
    await friendshipRepo.delete({friend_id, user_id});

    return res.status(204);
  },

  async block(req: Request, res: Response) {
    const { friendname } = req.params;

    const userRepo = new UserRepo();
    const friend = await userRepo.getByUsername(friendname);
    if (!friend) throw NotFoundException();

    const user_id   = req.session.user_id!;
    const friend_id = friend.user_id;

    const friendshipRepo = new FriendshipRepo();

    await friendshipRepo.delete({user_id, friend_id});
    await friendshipRepo.delete({friend_id, user_id});

    // to clarify what's going on here:
    // user_id    is blocking          friend_id
    // friend_id  is being blocked by  user_id
    await friendshipRepo.insert({user_id, friend_id, status: "blocked"});

    return res.status(204);
  },

  async unblock(req: Request, res: Response) {
    const { friendname } = req.params;

    const userRepo = new UserRepo();
    const friend = await userRepo.getByUsername(friendname);
    if (!friend) throw NotFoundException();

    const user_id   = req.session.user_id!;
    const friend_id = friend.user_id;

    const friendshipRepo = new FriendshipRepo();
    const status = await friendshipRepo.getStatus({user_id, friend_id});
    if (status !== "blocked") throw ForbiddenException();

    await friendshipRepo.delete({user_id, friend_id});

    return res.status(204);
  }
};
