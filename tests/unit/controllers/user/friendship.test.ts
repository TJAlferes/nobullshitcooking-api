import type { Request, Response } from 'express';
import type { ModifiedSession } from '../../../../src/app';

import { friendshipController as controller } from '../../../../src/modules/user/friendship/controller';
import { FriendshipRepo } from '../../../../src/modules/user/friendship/repo';
import { UserRepo } from '../../../../src/modules/user/repo';

jest.mock('../../../../src/modules/user/friendship/repo');
jest.mock('../../../../src/modules/user/repo');

const mockedFriendshipRepo = FriendshipRepo as unknown as jest.Mocked<FriendshipRepo>;
const mockedUserRepo = UserRepo as unknown as jest.Mocked<UserRepo>;

const row = {id: 1, name: "Name"};
const rows = [
  {id: 1, name: "Name"},
  {id: 2, name: "Name"}
];

interface MockRequest extends Request {
  session: ModifiedSession;
}

describe('friendship controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: {
        friendname: 'Name'
      },
      session: {
        user_id: '123'
      },
    } as MockRequest;
    res = {
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create method', () => {
    it('should handle when desired friend does not exist', async () => {
      mockedUserRepo.getByUsername.mockResolvedValue([]);  // null ???
      await controller.create(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'User not found.'});
    });

    it('should handle when blocked by desired friend', async () => {
      mockedFriendshipRepo.getOne.mockResolvedValue({user: "Name", friend: "Name1"});
      mockedUserRepo.getByUsername.mockResolvedValue({username: "Name1", avatar: "Name1"});
      req.body.friendname = 'Name1';
  
      await controller.create(<Request>req, <Response>res);

      expect(res.send).toHaveBeenCalledWith({message: 'User not found.'});
    });

    it('should handle successful friendship creation', async () => {
      //mockcheckIfBlockedBy = jest.fn().mockResolvedValue([[]]);
      //mockgetByFriendId = jest.fn().mockResolvedValue([[]]);
      //mockviewByName = jest.fn().mockResolvedValue([[{username: "Name1", avatar: "Name1"}]]);
      mockedFriendshipRepo.getOne.mockResolvedValue(null);
      mockedUserRepo.getByUsername.mockResolvedValue({
        user_id: '456',
      });

      await controller.create(<Request>req, <Response>res);
  
      expect(res.send).toHaveBeenCalledWith({message: 'Friendship request sent.'});
    });

    it('should handle when status is pending-sent', async () => {
      mockcheckIfBlockedBy = jest.fn().mockResolvedValue([[]]);
      mockgetByFriendId = jest.fn().mockResolvedValue([
        [{user: "Name", friend: "Name1", status: "pending-sent"}]
      ]);
      mockviewByName = jest.fn().mockResolvedValue([[{username: "Name1", avatar: "Name1"}]]);
  
      await controller.create(<Request>req, <Response>res);

      expect(res.send).toHaveBeenCalledWith({message: 'Already sent.'});
    });

    it('should handle when status is pending-received', async () => {
      mockcheckIfBlockedBy = jest.fn().mockResolvedValue([[]]);
      mockgetByFriendId = jest.fn().mockResolvedValue([
        [{user: "Name", friend: "Name1", status: "pending-received"}]
      ]);
      mockviewByName = jest.fn().mockResolvedValue([[{username: "Name1", avatar: "Name1"}]]);

      await controller.create(<Request>req, <Response>res);

      expect(res.send).toHaveBeenCalledWith({message: 'Already received.'});
    });

    it('should handle when status is accepted', async () => {
      mockcheckIfBlockedBy = jest.fn().mockResolvedValue([[]]);
      mockgetByFriendId =  jest.fn().mockResolvedValue([
        [{user: "Name", friend: "Name1", status: "accepted"}]
      ]);
      mockviewByName = jest.fn().mockResolvedValue([[{username: "Name1", avatar: "Name1"}]]);

      await controller.create(<Request>req, <Response>res);

      expect(res.send).toHaveBeenCalledWith({message: 'Already friends.'});
    });

    it('should handle when status is blocked', async () => {
      mockcheckIfBlockedBy = jest.fn().mockResolvedValue([[]]);
      mockgetByFriendId =  jest.fn().mockResolvedValue([
        [{user: "Name", friend: "Name1", status: "blocked"}]
      ]);
      mockviewByName = jest.fn().mockResolvedValue([[{username: "Name1", avatar: "Name1"}]]);
      
      await controller.create(<Request>req, <Response>res);

      expect(res.send).toHaveBeenCalledWith({message: 'User blocked. First unblock.'});
    });
  });

  describe('accept method', () => {
    it('should handle when desired friend does not exist', async () => {
      mockviewByName = jest.fn().mockResolvedValue([[]]);
      await controller.accept(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'User not found.'});
    });

    it('should handle when desired friend exists', async () => {
      mockviewByName = jest.fn().mockResolvedValue([[{username: "Name1", avatar: "Name1"}]]);
      await controller.accept(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Friendship request accepted.'});
    });
  });

  describe('reject method', () => {
    it('should handle when desired friend does not exist', async () => {
      mockviewByName = jest.fn().mockResolvedValue([[]]);
      await controller.reject(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'User not found.'});
    });

    it('should handle when desired friend exists', async () => {
      mockviewByName = jest.fn().mockResolvedValue([[{username: "Name1", avatar: "Name1"}]]);
      await controller.reject(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'Friendship request rejected.'});
    });
  });

  describe('delete method', () => {
    it('should handle when desired friend does not exist', async () => {
      mockviewByName = jest.fn().mockResolvedValue([[]]);
      await controller.delete(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'User not found.'});
    });

    it('should handle when desired friend exists', async () => {
      mockviewByName = jest.fn().mockResolvedValue([[{username: "Name1", avatar: "Name1"}]]);
      await controller.delete(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'No longer friends. Maybe again later.'});
    });
  });

  describe('block method', () => {
    it('should handle when desired friend does not exist', async () => {
      mockviewByName = jest.fn().mockResolvedValue([[]]);
      await controller.block(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'User not found.'});
    });

    it('should handle when desired friend exists', async () => {
      mockviewByName = jest.fn().mockResolvedValue([[{username: "Name1", avatar: "Name1"}]]);
      await controller.block(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'User blocked.'});
    });
  });

  describe('unblock method', () => {
    it('should handle when desired friend does not exist', async () => {
      mockviewByName = jest.fn().mockResolvedValue([[]]);
      await controller.unblock(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'User not found.'});
    });

    it('should handle when desired friend exists', async () => {
      mockviewByName = jest.fn().mockResolvedValue([[{username: "Name1", avatar: "Name1"}]]);
      await controller.unblock(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith({message: 'User unblocked.'});
    });
  });
});
