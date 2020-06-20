import { Request, Response } from 'express';
import { assert } from 'superstruct';

import { pool } from '../../lib/connections/mysqlPoolConnection';
import {
  validFriendshipEntity
} from '../../lib/validations/friendship/friendshipEntity';
import { Friendship } from '../../mysql-access/Friendship';
import { User } from '../../mysql-access/User';

export const userFriendshipController = {
  viewMyFriendships: async function(req: Request, res: Response) {
    const userId = req.session!.userInfo.userId;

    const friendship = new Friendship(pool);

    const rows = await friendship.viewMyFriendships(userId);

    return res.send(rows);
  },
  createFriendship: async function(req: Request, res: Response) {
    const friendName = req.body.friendName;

    const user = new User(pool);

    const [ friendExists ] = await user.viewUserByName(friendName);
    
    if (!friendExists.length) return res.send({message: 'User not found.'});

    const friendId = friendExists[0].user_id;
    const userId = req.session!.userInfo.userId;

    const friendship = new Friendship(pool);

    const [ blockedBy ] = await friendship.checkIfBlockedBy(userId, friendId);
    
    if (blockedBy.length) return res.send({message: 'User not found.'});

    const [ friendshipExists ] = await friendship
    .getFriendshipByFriendId(userId, friendId);

    if (!friendshipExists.length) {
      const friendshipToCreate = {
        userId,
        friendId,
        status1: "pending-sent",
        status2: "pending-received"
      };
  
      assert(friendshipToCreate, validFriendshipEntity);

      await friendship.createFriendship(friendshipToCreate);

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
  acceptFriendship: async function(req: Request, res: Response) {
    const friendName = req.body.friendName;

    const user = new User(pool);

    const friendExists = await user.viewUserByName(friendName);
    if (!friendExists.length) return res.send({message: 'User not found.'});

    const friendId = friendExists[0].user_id;
    const userId = req.session!.userInfo.userId;

    const friendship = new Friendship(pool);

    await friendship.acceptFriendship(userId, friendId);

    return res.send({message: 'Friendship request accepted.'});
  },
  rejectFriendship: async function(req: Request, res: Response) {
    const friendName = req.body.friendName;

    const user = new User(pool);

    const friendExists = await user.viewUserByName(friendName);
    if (!friendExists.length) return res.send({message: 'User not found.'});

    const friendId = friendExists[0].user_id;
    const userId = req.session!.userInfo.userId;

    const friendship = new Friendship(pool);

    await friendship.rejectFriendship(userId, friendId);

    return res.send({message: 'Friendship request rejected.'});
  },
  deleteFriendship: async function(req: Request, res: Response) {
    const friendName = req.body.friendName;

    const user = new User(pool);

    const friendExists = await user.viewUserByName(friendName);
    if (!friendExists.length) return res.send({message: 'User not found.'});

    const friendId = friendExists[0].user_id;
    const userId = req.session!.userInfo.userId;

    const friendship = new Friendship(pool);

    await friendship.deleteFriendship(userId, friendId);

    return res.send({message: 'No longer friends. Maybe again later.'});
  },
  blockUser: async function(req: Request, res: Response) {
    const friendName = req.body.friendName;

    const user = new User(pool);

    const friendExists = await user.viewUserByName(friendName);
    if (!friendExists.length) return res.send({message: 'User not found.'});

    const friendId = friendExists[0].user_id;
    const userId = req.session!.userInfo.userId;

    const friendship = new Friendship(pool);

    await friendship.blockUser(userId, friendId);

    return res.send({message: 'User blocked.'});
  },
  unblockUser: async function(req: Request, res: Response) {
    const friendName = req.body.friendName;

    const user = new User(pool);

    const friendExists = await user.viewUserByName(friendName);
    if (!friendExists.length) return res.send({message: 'User not found.'});

    const friendId = friendExists[0].user_id;
    const userId = req.session!.userInfo.userId;

    const friendship = new Friendship(pool);
    
    await friendship.unblockUser(userId, friendId);

    return res.send({message: 'User unblocked.'});
  }
};