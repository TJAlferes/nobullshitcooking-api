import { Request, Response } from 'express';

import { UserRepo }       from '../repo';
import { Friendship }     from './model';
import { FriendshipRepo } from './repo';

export const friendshipController = {
  async viewAll(req: Request, res: Response) {
    const user_id = req.session.user_id!;

    const friendshipRepo = new FriendshipRepo();
    const rows = await friendshipRepo.viewAll(user_id);

    return res.send(rows);
  },

  async create(req: Request, res: Response) {
    const { friendname } = req.body;

    const userRepo = new UserRepo();
    const friend = await userRepo.getByUsername(friendname);
    if (!friend) {
      return res.send({message: 'User not found.'});
    }

    const user_id   = req.session.user_id!;
    const friend_id = friend.user_id;

    // do others need this too? probably
    const friendshipRepo = new FriendshipRepo();
    const status = await friendshipRepo.getStatus({user_id: friend_id, friend_id: user_id});
    if (status === "blocked") {
      return res.send({message: 'User not found.'});
    }

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

      return res.send({message: 'Friendship request sent.'});
    }

    if ( currentStatus === "pending-sent"
      || currentStatus === "pending-received"
    ) {
      return res.send({message: 'Already pending.'});
    }

    if (currentStatus === "accepted") {
      return res.send({message: 'Already friends.'});
    }

    if (currentStatus === "blocked") {
      return res.send({message: 'User blocked. First unblock.'});
    }
  },

  async accept(req: Request, res: Response) {
    const { friendname } = req.body;

    const userRepo = new UserRepo();
    const friend = await userRepo.getByUsername(friendname);
    if (!friend) {
      return res.send({message: 'User not found.'});
    }

    const user_id   = req.session.user_id!;
    const friend_id = friend.user_id;

    const friendshipRepo = new FriendshipRepo();
    const status = await friendshipRepo.getStatus({user_id, friend_id});
    if (status !== "pending-received") return;

    await friendshipRepo.update({user_id, friend_id, status: "accepted"});
    await friendshipRepo.update({friend_id, user_id, status: "accepted"});

    return res.send({message: 'Friendship request accepted.'});
  },

  async reject(req: Request, res: Response) {
    const { friendname } = req.body;

    const userRepo = new UserRepo();
    const friend = await userRepo.getByUsername(friendname);
    if (!friend) {
      return res.send({message: 'User not found.'});
    }

    const user_id   = req.session.user_id!;
    const friend_id = friend.user_id;

    const friendshipRepo = new FriendshipRepo();
    const status = await friendshipRepo.getStatus({user_id, friend_id});
    if (status !== "pending-received") return;

    await friendshipRepo.delete({user_id, friend_id});
    await friendshipRepo.delete({friend_id, user_id});

    return res.send({message: 'Friendship request rejected.'});
  },

  async delete(req: Request, res: Response) {
    const { friendname } = req.body;

    const userRepo = new UserRepo();
    const friend = await userRepo.getByUsername(friendname);
    if (!friend) {
      return res.send({message: 'User not found.'});
    }

    const user_id   = req.session.user_id!;
    const friend_id = friend.user_id;

    const friendshipRepo = new FriendshipRepo();
    const status = await friendshipRepo.getStatus({user_id, friend_id});
    if (status !== "accepted") return;

    await friendshipRepo.delete({user_id, friend_id});
    await friendshipRepo.delete({friend_id, user_id});

    return res.send({message: 'No longer friends. Maybe again later.'});
  },

  async block(req: Request, res: Response) {
    const { friendname } = req.body;

    const userRepo = new UserRepo();
    const friend = await userRepo.getByUsername(friendname);
    if (!friend) {
      return res.send({message: 'User not found.'});
    }

    const user_id   = req.session.user_id!;
    const friend_id = friend.user_id;

    const friendshipRepo = new FriendshipRepo();

    await friendshipRepo.delete({user_id, friend_id});
    await friendshipRepo.delete({friend_id, user_id});

    // to clarify what's going on here:
    // user_id    is blocking          friend_id
    // friend_id  is being blocked by  user_id
    await friendshipRepo.insert({user_id, friend_id, status: "blocked"});

    return res.send({message: 'User blocked.'});
  },

  async unblock(req: Request, res: Response) {
    const { friendname } = req.body;

    const userRepo = new UserRepo();
    const friend = await userRepo.getByUsername(friendname);
    if (!friend) {
      return res.send({message: 'User not found.'});
    }

    const user_id   = req.session.user_id!;
    const friend_id = friend.user_id;

    const friendshipRepo = new FriendshipRepo();
    const status = await friendshipRepo.getStatus({user_id, friend_id});
    if (status !== "blocked") return;

    await friendshipRepo.delete({user_id, friend_id});

    return res.send({message: 'User unblocked.'});
  }
};
