import { Request, Response } from 'express';

import { UserRepo }       from '../repo';
import { FriendshipRepo } from './repo';
import { Friendship }     from './model';

export const userFriendshipController = {
  async view(req: Request, res: Response) {
    const user_id = req.session.userInfo!.user_id;

    const friendshipRepo = new FriendshipRepo();
    const rows = await friendshipRepo.view(user_id);

    return res.send(rows);
  },

  async create(req: Request, res: Response) {
    const { friendname } = req.body;

    const userRepo = new UserRepo();
    const friend = await userRepo.getByUsername(friendname);
    if (!friend) {
      return res.send({message: 'User not found.'});
    }

    const user_id   = req.session.userInfo!.user_id;
    const friend_id = friend.user_id;

    // do others need this too? probably
    const friendshipRepo = new FriendshipRepo();
    const blockedBy = await friendshipRepo.checkIfBlockedBy({user_id, friend_id});
    if (blockedBy) return res.send({message: 'User not found.'});

    // do others need this too? probably
    const friendshipExists = await friendshipRepo.getByFriendId({user_id, friend_id});
    if (!friendshipExists) {
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

    if (friendshipExists.status === "pending") {
      return res.send({message: 'Already pending.'});
    }

    if (friendshipExists.status === "accepted") {
      return res.send({message: 'Already friends.'});
    }

    if (friendshipExists.status === "blocked") {
      return res.send({message: 'User blocked. First unblock.'});
    }
  },

  async accept(req: Request, res: Response) {
    // the user_id is the request sender,
    // the friend_id is the request receiver
    // so only the friend_id can accept
    const { friendname } = req.body;

    const userRepo = new UserRepo();
    const friend = await userRepo.getByUsername(friendname);
    if (!friend) {
      return res.send({message: 'User not found.'});
    }

    const user_id   = req.session.userInfo!.user_id;
    const friend_id = friend.user_id;

    const friendshipRepo = new FriendshipRepo();
    await friendshipRepo.accept({user_id, friend_id});

    return res.send({message: 'Friendship request accepted.'});
  },

  async reject(req: Request, res: Response) {
    // the user_id is the request sender,
    // the friend_id is the request receiver
    // so only the friend_id can reject
    const { friendname } = req.body;

    const userRepo = new UserRepo();
    const friend = await userRepo.getByUsername(friendname);
    if (!friend) {
      return res.send({message: 'User not found.'});
    }

    const user_id   = req.session.userInfo!.user_id;
    const friend_id = friend.user_id;

    const friendshipRepo = new FriendshipRepo();
    await friendshipRepo.reject({user_id, friend_id});

    return res.send({message: 'Friendship request rejected.'});
  },

  async delete(req: Request, res: Response) {
    // either one can delete
    const { friendname } = req.body;

    const userRepo = new UserRepo();
    const friend = await userRepo.getByUsername(friendname);
    if (!friend) {
      return res.send({message: 'User not found.'});
    }

    const user_id   = req.session.userInfo!.user_id;
    const friend_id = friend.user_id;

    const friendshipRepo = new FriendshipRepo();
    await friendshipRepo.delete({user_id, friend_id});

    return res.send({message: 'No longer friends. Maybe again later.'});
  },

  async block(req: Request, res: Response) {
    const { friendname } = req.body;

    const userRepo = new UserRepo();
    const friend = await userRepo.getByUsername(friendname);
    if (!friend) {
      return res.send({message: 'User not found.'});
    }

    const user_id   = req.session.userInfo!.user_id;
    const friend_id = friend.user_id;

    const friendshipRepo = new FriendshipRepo();

    await friendshipRepo.delete({user_id, friend_id});
    await friendshipRepo.delete({friend_id, user_id});

    // to clarify what's going on here:
    // user_id   is blocking         friend_id
    // friend_id is being blocked by user_id
    await friendshipRepo.insert({user_id, friend_id, status: "blocked"});

    return res.send({message: 'User blocked.'});
  },

  async unblock(req: Request, res: Response) {
    // only the user_id can block
    const { friendname } = req.body;

    const userRepo = new UserRepo();
    const friend = await userRepo.getByUsername(friendname);
    if (!friend) {
      return res.send({message: 'User not found.'});
    }

    const user_id   = req.session.userInfo!.user_id;
    const friend_id = friend.user_id;

    const friendshipRepo = new FriendshipRepo();
    await friendshipRepo.unblock({user_id, friend_id});

    return res.send({message: 'User unblocked.'});
  }
};
