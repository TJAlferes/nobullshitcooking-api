import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import { Friendship } from '../../access/mysql/Friendship';
import { User } from '../../access/mysql/User';
import { validFriendshipEntity } from '../../lib/validations/friendship/entity';

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
    const username = req.session!.userInfo.username;

    const friendship = new Friendship(this.pool);

    const rows = await friendship.view(username);

    return res.send(rows);
  }

  async create(req: Request, res: Response) {
    const { friend } = req.body;
    const username = req.session!.userInfo.username;

    const user = new User(this.pool);

    const [ friendExists ] = await user.viewByName(friend);

    if (!friendExists.length) return res.send({message: 'User not found.'});

    const friendship = new Friendship(this.pool);

    const [ blockedBy ] = await friendship.checkIfBlockedBy(username, friend);

    if (blockedBy.length) return res.send({message: 'User not found.'});

    const [ friendshipExists ] = await friendship.getByFriend(username, friend);

    if (!friendshipExists.length) {
      const friendshipToCreate = {
        username,
        friend,
        status1: "pending-sent",
        status2: "pending-received"
      };
  
      assert(friendshipToCreate, validFriendshipEntity);

      await friendship.create(friendshipToCreate);

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
    const { friend } = req.body;

    const user = new User(this.pool);

    const [ friendExists ] = await user.viewByName(friend);

    if (!friendExists.length) return res.send({message: 'User not found.'});

    const username = req.session!.userInfo.username;

    const friendship = new Friendship(this.pool);

    await friendship.accept(username, friend);

    return res.send({message: 'Friendship request accepted.'});
  }

  async reject(req: Request, res: Response) {
    const { friend } = req.body;

    const user = new User(this.pool);

    const [ friendExists ] = await user.viewByName(friend);

    if (!friendExists.length) return res.send({message: 'User not found.'});

    const username = req.session!.userInfo.username;

    const friendship = new Friendship(this.pool);

    await friendship.reject(username, friend);

    return res.send({message: 'Friendship request rejected.'});
  }

  async delete(req: Request, res: Response) {
    const { friend } = req.body;

    const user = new User(this.pool);

    const [ friendExists ] = await user.viewByName(friend);

    if (!friendExists.length) return res.send({message: 'User not found.'});

    const username = req.session!.userInfo.username;

    const friendship = new Friendship(this.pool);

    await friendship.delete(username, friend);

    return res.send({message: 'No longer friends. Maybe again later.'});
  }

  async block(req: Request, res: Response) {
    const { friend } = req.body;

    const user = new User(this.pool);

    const [ friendExists ] = await user.viewByName(friend);

    if (!friendExists.length) return res.send({message: 'User not found.'});

    const username = req.session!.userInfo.username;

    const friendship = new Friendship(this.pool);

    await friendship.block(username, friend);

    return res.send({message: 'User blocked.'});
  }

  async unblock(req: Request, res: Response) {
    const { friend } = req.body;

    const user = new User(this.pool);

    const [ friendExists ] = await user.viewByName(friend);

    if (!friendExists.length) return res.send({message: 'User not found.'});

    const username = req.session!.userInfo.username;

    const friendship = new Friendship(this.pool);
    
    await friendship.unblock(username, friend);

    return res.send({message: 'User unblocked.'});
  }
};