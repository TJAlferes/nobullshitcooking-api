import { Request, Response } from 'express';
import { assert }            from 'superstruct';

import { FriendshipRepo, UserRepo } from '../../repos/mysql';
import { validFriendship }          from '../../lib/validations';

export class UserFriendshipController {
  async view(req: Request, res: Response) {
    const userId = req.session.userInfo!.id;
    const friendshipRepo = new FriendshipRepo();
    const rows = await friendshipRepo.view(userId);
    return res.send(rows);
  }

  async create(req: Request, res: Response) {
    const { friend } = req.body;
    const userRepo = new UserRepo();
    const friendExists = await userRepo.viewByName(friend);
    if (!friendExists.length) return res.send({message: 'User not found.'});

    const friendId = friendExists[0].id;
    const userId = req.session.userInfo!.id;
    const friendshipRepo = new FriendshipRepo();
    const blockedBy = await friendshipRepo.checkIfBlockedBy(userId, friendId);
    if (blockedBy.length) return res.send({message: 'User not found.'});

    const friendshipExists = await friendshipRepo.getByFriendId(userId, friendId);
    if (!friendshipExists.length) {
      const args = {userId, friendId, status1: "pending-sent", status2: "pending-received"};
      assert(args, validFriendship);
      await friendshipRepo.create(args);
      return res.send({message: 'Friendship request sent.'});
    }

    const { status } = friendshipExists[0];
    if (status === "pending-sent")     return res.send({message: 'Already sent.'});
    if (status === "pending-received") return res.send({message: 'Already received.'});
    if (status === "accepted")         return res.send({message: 'Already friends.'});
    if (status === "blocked")          return res.send({message: 'User blocked. First unblock.'});
  }

  async accept(req: Request, res: Response) {
    const { friend } = req.body;
    const userRepo = new UserRepo();
    const friendExists = await userRepo.viewByName(friend);
    if (!friendExists.length) return res.send({message: 'User not found.'});

    const friendId = friendExists[0].id;
    const userId = req.session.userInfo!.id;
    const friendshipRepo = new FriendshipRepo();
    await friendshipRepo.accept(userId, friendId);
    return res.send({message: 'Friendship request accepted.'});
  }

  async reject(req: Request, res: Response) {
    const { friend } = req.body;
    const userRepo = new UserRepo();
    const friendExists = await userRepo.viewByName(friend);
    if (!friendExists.length) return res.send({message: 'User not found.'});

    const friendId = friendExists[0].id;
    const userId = req.session.userInfo!.id;
    const friendshipRepo = new FriendshipRepo();
    await friendshipRepo.reject(userId, friendId);
    return res.send({message: 'Friendship request rejected.'});
  }

  async delete(req: Request, res: Response) {
    const { friend } = req.body;
    const userRepo = new UserRepo();
    const friendExists = await userRepo.viewByName(friend);
    if (!friendExists.length) return res.send({message: 'User not found.'});

    const friendId =   friendExists[0].id;
    const userId =     req.session.userInfo!.id;
    const friendshipRepo = new FriendshipRepo();
    await friendshipRepo.delete(userId, friendId);
    return res.send({message: 'No longer friends. Maybe again later.'});
  }

  async block(req: Request, res: Response) {
    const { friend } = req.body;
    const userRepo = new UserRepo();
    const friendExists = await userRepo.viewByName(friend);
    if (!friendExists.length) return res.send({message: 'User not found.'});

    const friendId =   friendExists[0].id;
    const userId =     req.session.userInfo!.id;
    const friendshipRepo = new FriendshipRepo();
    await friendshipRepo.block(userId, friendId);
    return res.send({message: 'User blocked.'});
  }

  async unblock(req: Request, res: Response) {
    const { friend } = req.body;
    const userRepo = new UserRepo();
    const friendExists = await userRepo.viewByName(friend);
    if (!friendExists.length) return res.send({message: 'User not found.'});

    const friendId =   friendExists[0].id;
    const userId =     req.session.userInfo!.id;
    const friendshipRepo = new FriendshipRepo();
    await friendshipRepo.unblock(userId, friendId);
    return res.send({message: 'User unblocked.'});
  }
}
