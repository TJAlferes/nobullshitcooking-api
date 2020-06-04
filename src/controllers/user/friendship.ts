import { Request, Response } from 'express';

import { pool } from '../../lib/connections/mysqlPoolConnection';
import {
  validFriendshipEntity
} from '../../lib/validations/friendship/friendshipEntity';
import { Friendship } from '../../mysql-access/Friendship';
import { User } from '../../mysql-access/User';

export const userFriendshipController = {
  viewAllMyFriendships: async function(req: Request, res: Response) {
    const userId = req.session!.userInfo.userId;

    const friendship = new Friendship(pool);

    const rows = await friendship.viewAllMyFriendships(userId);

    res.send(rows);
  },
  createFriendship: async function(req: Request, res: Response) {
    const friendName = req.body.friendName;

    const user = new User(pool);

    const friendExists = await user.getUserIdByUsername(friendName);
    if (!friendExists.length) return res.send({message: 'User not found.'});

    const friendId = friendExists[0].user_id;
    const userId = req.session!.userInfo.userId;
    const status1 = "pending-sent";
    const status2 = "pending-received";
    
    const friendshipToCreate = validFriendshipEntity({
      userId,
      friendId,
      status1,
      status2
    });

    const friendship = new Friendship(pool);

    const blockedBy = await friendship.checkIfBlockedBy(userId, friendId);
    if (blockedBy.length) return res.send({message: 'User not found.'});

    const friendshipExists = await friendship
    .getFriendshipByFriendId(userId, friendId);
    if (!friendshipExists.length) return res.send({message: 'User not found.'});
    if (friendshipExists[0].status === "pending-sent") {
      return res.send({message: 'Already sent.'});
    }
    if (friendshipExists[0].status === "pending-received") {
      return res.send({message: 'Already received.'});
    }
    if (friendshipExists[0].status === "accepted") {
      return res.send({message: 'Already friends.'});
    }
    if (friendshipExists[0].status === "blocked") {
      return res.send({message: 'User blocked. First unblock.'});
    }

    await friendship.createFriendship(friendshipToCreate);

    res.send({message: 'Friendship request sent.'});
  },
  acceptFriendship: async function(req: Request, res: Response) {
    const friendName = req.body.friendName;

    const user = new User(pool);

    const friendExists = await user.getUserIdByUsername(friendName);
    if (!friendExists.length) return res.send({message: 'User not found.'});

    const friendId = friendExists[0].user_id;
    const userId = req.session!.userInfo.userId;

    const friendship = new Friendship(pool);

    await friendship.acceptFriendship(userId, friendId);

    res.send({message: 'Friendship request accepted.'});
  },
  rejectFriendship: async function(req: Request, res: Response) {
    const friendName = req.body.friendName;

    const user = new User(pool);

    const friendExists = await user.getUserIdByUsername(friendName);
    if (!friendExists.length) return res.send({message: 'User not found.'});

    const friendId = friendExists[0].user_id;
    const userId = req.session!.userInfo.userId;

    const friendship = new Friendship(pool);

    await friendship.rejectFriendship(userId, friendId);

    res.send({message: 'Friendship request rejected.'});
  },
  deleteFriendship: async function(req: Request, res: Response) {
    const friendName = req.body.friendName;

    const user = new User(pool);

    const friendExists = await user.getUserIdByUsername(friendName);
    if (!friendExists.length) return res.send({message: 'User not found.'});

    const friendId = friendExists[0].user_id;
    const userId = req.session!.userInfo.userId;

    const friendship = new Friendship(pool);

    await friendship.deleteFriendship(userId, friendId);

    res.send({message: 'No longer friends. Maybe again later.'});
  },
  blockUser: async function(req: Request, res: Response) {
    const friendName = req.body.friendName;

    const user = new User(pool);

    const friendExists = await user.getUserIdByUsername(friendName);
    if (!friendExists.length) return res.send({message: 'User not found.'});

    const friendId = friendExists[0].user_id;
    const userId = req.session!.userInfo.userId;

    const friendship = new Friendship(pool);

    await friendship.blockUser(userId, friendId);

    res.send({message: 'User blocked.'});
  },
  unblockUser: async function(req: Request, res: Response) {
    const friendName = req.body.friendName;

    const user = new User(pool);

    const friendExists = await user.getUserIdByUsername(friendName);
    if (!friendExists.length) return res.send({message: 'User not found.'});

    const friendId = friendExists[0].user_id;
    const userId = req.session!.userInfo.userId;

    const friendship = new Friendship(pool);
    
    await friendship.unblockUser(userId, friendId);

    res.send({message: 'User unblocked.'});
  }
};