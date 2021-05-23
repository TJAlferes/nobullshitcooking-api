import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import { Friendship, User } from '../../access/mysql';
import { validFriendship } from '../../lib/validations/entities';

export class UserFriendshipController {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
    this.create = this.create.bind(this);
    this.accept = this.accept.bind(this);
    this.reject = this.reject.bind(this);
    this.delete = this.delete.bind(this);
    this.block = this.block.bind(this);
    this.unblock = this.unblock.bind(this);
  }

  async view(req: Request, res: Response) {
    const userId = req.session.userInfo!.id;
    const friendship = new Friendship(this.pool);
    const rows = await friendship.view(userId);
    return res.send(rows);
  }

  async create(req: Request, res: Response) {
    const { friendName } = req.body;
    const user = new User(this.pool);
    const friendExists = await user.viewByName(friendName);
    if (!friendExists.length) return res.send({message: 'User not found.'});

    const friendId = friendExists[0].id;
    const userId = req.session.userInfo!.id;
    const friendship = new Friendship(this.pool);
    const blockedBy = await friendship.checkIfBlockedBy(userId, friendId);
    if (blockedBy.length) return res.send({message: 'User not found.'});

    const friendshipExists = await friendship.getByFriendId(userId, friendId);
    if (!friendshipExists.length) {
      const args = {
        userId,
        friendId,
        status1: "pending-sent",
        status2: "pending-received"
      };
      assert(args, validFriendship);
      await friendship.create(args);
      return res.send({message: 'Friendship request sent.'});
    }

    const { status } = friendshipExists[0];
    if (status === "pending-sent") {
      return res.send({message: 'Already sent.'});
    }
    if (status === "pending-received") {
      return res.send({message: 'Already received.'});
    }
    if (status === "accepted") {
      return res.send({message: 'Already friends.'});
    }
    if (status === "blocked") {
      return res.send({message: 'User blocked. First unblock.'});
    }
  }

  async accept(req: Request, res: Response) {
    const { friendName } = req.body;
    const user = new User(this.pool);
    const friendExists = await user.viewByName(friendName);
    if (!friendExists.length) return res.send({message: 'User not found.'});

    const friendId = friendExists[0].id;
    const userId = req.session.userInfo!.id;
    const friendship = new Friendship(this.pool);
    await friendship.accept(userId, friendId);
    return res.send({message: 'Friendship request accepted.'});
  }

  async reject(req: Request, res: Response) {
    const { friendName } = req.body;
    const user = new User(this.pool);
    const friendExists = await user.viewByName(friendName);
    if (!friendExists.length) return res.send({message: 'User not found.'});

    const friendId = friendExists[0].id;
    const userId = req.session.userInfo!.id;
    const friendship = new Friendship(this.pool);
    await friendship.reject(userId, friendId);
    return res.send({message: 'Friendship request rejected.'});
  }

  async delete(req: Request, res: Response) {
    const { friendName } = req.body;
    const user = new User(this.pool);
    const friendExists = await user.viewByName(friendName);
    if (!friendExists.length) return res.send({message: 'User not found.'});

    const friendId = friendExists[0].id;
    const userId = req.session.userInfo!.id;
    const friendship = new Friendship(this.pool);
    await friendship.delete(userId, friendId);
    return res.send({message: 'No longer friends. Maybe again later.'});
  }

  async block(req: Request, res: Response) {
    const { friendName } = req.body;
    const user = new User(this.pool);
    const friendExists = await user.viewByName(friendName);
    if (!friendExists.length) return res.send({message: 'User not found.'});

    const friendId = friendExists[0].id;
    const userId = req.session.userInfo!.id;
    const friendship = new Friendship(this.pool);
    await friendship.block(userId, friendId);
    return res.send({message: 'User blocked.'});
  }

  async unblock(req: Request, res: Response) {
    const { friendName } = req.body;
    const user = new User(this.pool);
    const friendExists = await user.viewByName(friendName);
    if (!friendExists.length) return res.send({message: 'User not found.'});

    const friendId = friendExists[0].id;
    const userId = req.session.userInfo!.id;
    const friendship = new Friendship(this.pool);
    await friendship.unblock(userId, friendId);
    return res.send({message: 'User unblocked.'});
  }
};