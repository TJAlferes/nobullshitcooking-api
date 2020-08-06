import { Request, Response } from 'express';
import { assert } from 'superstruct';

import { pool } from '../../lib/connections/mysqlPoolConnection';
import {
  validFriendshipEntity
} from '../../lib/validations/friendship/friendshipEntity';
import { Friendship } from '../../mysql-access/Friendship';
import { User } from '../../mysql-access/User';

export const userFriendshipController = {
  view: async function(req: Request, res: Response) {
    const userId = req.session!.userInfo.id;

    const friendship = new Friendship(pool);

    const rows = await friendship.view(userId);

    return res.send(rows);
  },
  create: async function(req: Request, res: Response) {
    const { friendName } = req.body;

    const user = new User(pool);

    const [ friendExists ] = await user.viewByName(friendName);
    if (!friendExists.length) return res.send({message: 'User not found.'});

    const friendId = friendExists[0].id;
    const userId = req.session!.userInfo.id;

    const friendship = new Friendship(pool);

    const [ blockedBy ] = await friendship.checkIfBlockedBy(userId, friendId);
    if (blockedBy.length) return res.send({message: 'User not found.'});

    const [ friendshipExists ] =
      await friendship.getByFriendId(userId, friendId);
    if (!friendshipExists.length) {
      const friendshipToCreate = {
        userId,
        friendId,
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
  },
  accept: async function(req: Request, res: Response) {
    const { friendName } = req.body;

    const user = new User(pool);

    const [ friendExists ] = await user.viewByName(friendName);
    if (!friendExists.length) return res.send({message: 'User not found.'});

    const friendId = friendExists[0].id;
    const userId = req.session!.userInfo.id;

    const friendship = new Friendship(pool);

    await friendship.accept(userId, friendId);

    return res.send({message: 'Friendship request accepted.'});
  },
  reject: async function(req: Request, res: Response) {
    const { friendName } = req.body;

    const user = new User(pool);

    const [ friendExists ] = await user.viewByName(friendName);
    if (!friendExists.length) return res.send({message: 'User not found.'});

    const friendId = friendExists[0].id;
    const userId = req.session!.userInfo.id;

    const friendship = new Friendship(pool);

    await friendship.reject(userId, friendId);

    return res.send({message: 'Friendship request rejected.'});
  },
  delete: async function(req: Request, res: Response) {
    const { friendName } = req.body;

    const user = new User(pool);

    const [ friendExists ] = await user.viewByName(friendName);
    if (!friendExists.length) return res.send({message: 'User not found.'});

    const friendId = friendExists[0].id;
    const userId = req.session!.userInfo.id;

    const friendship = new Friendship(pool);

    await friendship.delete(userId, friendId);

    return res.send({message: 'No longer friends. Maybe again later.'});
  },
  block: async function(req: Request, res: Response) {
    const { friendName } = req.body;

    const user = new User(pool);

    const [ friendExists ] = await user.viewByName(friendName);
    if (!friendExists.length) return res.send({message: 'User not found.'});

    const friendId = friendExists[0].id;
    const userId = req.session!.userInfo.id;

    const friendship = new Friendship(pool);

    await friendship.block(userId, friendId);

    return res.send({message: 'User blocked.'});
  },
  unblock: async function(req: Request, res: Response) {
    const { friendName } = req.body;

    const user = new User(pool);

    const [ friendExists ] = await user.viewByName(friendName);
    if (!friendExists.length) return res.send({message: 'User not found.'});

    const friendId = friendExists[0].id;
    const userId = req.session!.userInfo.id;

    const friendship = new Friendship(pool);
    
    await friendship.unblock(userId, friendId);

    return res.send({message: 'User unblocked.'});
  }
};