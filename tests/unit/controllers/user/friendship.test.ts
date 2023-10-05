import type { Request, Response } from 'express';
import type { ModifiedSession } from '../../../../src/app';

import { friendshipController as controller } from '../../../../src/modules/user/friendship/controller';
import { FriendshipRepo } from '../../../../src/modules/user/friendship/repo';
import { UserRepo } from '../../../../src/modules/user/repo';
import type { UserData } from '../../../../src/modules/user/repo';

jest.mock('../../../../src/modules/user/friendship/repo');
jest.mock('../../../../src/modules/user/repo');

const friendshipRepoMock = FriendshipRepo as unknown as jest.Mocked<FriendshipRepo>;
const userRepoMock = UserRepo as unknown as jest.Mocked<UserRepo>;

interface MockRequest extends Request {
  session: ModifiedSession;
}

describe('friendship controller', () => {
  /*const user1Data = {
    user_id: '1',
    email: 'user1@nobsc.com',
    username: "user1",
    confirmation_code: "1"
  };*/
  const user2Data = {
    user_id: '2',
    email: 'user2@nobsc.com',
    username: "user2",
    confirmation_code: "2"
  };
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: {
        friendname: 'user2'
      },
      session: {
        user_id: '1'
      }
    } as MockRequest;
    res = {
      status: jest.fn(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create method', () => {
    it('should handle when desired friend does not exist', async () => {
      userRepoMock.getByUsername.mockResolvedValue(undefined);
      await controller.create(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should handle when blocked by desired friend', async () => {
      friendshipRepoMock.getStatus.mockResolvedValue("blocked");
      userRepoMock.getByUsername.mockResolvedValue(user2Data as UserData);
      req.body.friendname = 'user2';
  
      await controller.create(<Request>req, <Response>res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should handle success', async () => {
      friendshipRepoMock.getStatus.mockResolvedValue(undefined);
      userRepoMock.getByUsername.mockResolvedValue(user2Data as UserData);

      await controller.create(<Request>req, <Response>res);
  
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should handle when status is "pending-sent"', async () => {
      friendshipRepoMock.getStatus
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce("pending-sent");
      userRepoMock.getByUsername.mockResolvedValue(user2Data as UserData);
  
      await controller.create(<Request>req, <Response>res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({message: 'Already pending.'});
    });

    it('should handle when status is "pending-received"', async () => {
      friendshipRepoMock.getStatus
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce("pending-received");
      userRepoMock.getByUsername.mockResolvedValue(user2Data as UserData);

      await controller.create(<Request>req, <Response>res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({message: 'Already pending.'});
    });

    it('should handle when status is "accepted"', async () => {
      friendshipRepoMock.getStatus
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce("accepted");
      userRepoMock.getByUsername.mockResolvedValue(user2Data as UserData);

      await controller.create(<Request>req, <Response>res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({message: 'Already friends.'});
    });

    it('should handle when status is "blocked"', async () => {
      friendshipRepoMock.getStatus
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce("blocked");
      userRepoMock.getByUsername.mockResolvedValue(user2Data as UserData);
      
      await controller.create(<Request>req, <Response>res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({message: 'User blocked. First unblock.'});
    });
  });

  describe('accept method', () => {
    it('should handle when desired friend does not exist', async () => {
      userRepoMock.getByUsername.mockResolvedValue(undefined);
      await controller.accept(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should handle when status is not "pending-received"', async () => {
      friendshipRepoMock.getStatus.mockResolvedValue("blocked");
      userRepoMock.getByUsername.mockResolvedValue(user2Data as UserData);
      await controller.accept(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should handle success', async () => {
      userRepoMock.getByUsername.mockResolvedValue(user2Data as UserData);
      await controller.accept(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });

  describe('reject method', () => {
    it('should handle when desired friend does not exist', async () => {
      userRepoMock.getByUsername.mockResolvedValue(undefined);
      await controller.reject(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should handle when status is not "pending-received"', async () => {
      friendshipRepoMock.getStatus.mockResolvedValue("blocked");
      userRepoMock.getByUsername.mockResolvedValue(user2Data as UserData);
      await controller.reject(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should handle success', async () => {
      userRepoMock.getByUsername.mockResolvedValue(user2Data as UserData);
      await controller.reject(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });

  describe('delete method', () => {
    it('should handle when target friend does not exist', async () => {
      userRepoMock.getByUsername.mockResolvedValue(undefined);
      await controller.delete(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should handle when status is not "accepted"', async () => {
      friendshipRepoMock.getStatus.mockResolvedValue("blocked");
      userRepoMock.getByUsername.mockResolvedValue(user2Data as UserData);
      await controller.delete(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should handle success', async () => {
      userRepoMock.getByUsername.mockResolvedValue(user2Data as UserData);
      await controller.delete(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });

  describe('block method', () => {
    it('should handle when desired friend does not exist', async () => {
      userRepoMock.getByUsername.mockResolvedValue(undefined);
      await controller.block(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should handle success', async () => {
      userRepoMock.getByUsername.mockResolvedValue(user2Data as UserData);
      await controller.block(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });

  describe('unblock method', () => {
    it('should handle when target user does not exist', async () => {
      userRepoMock.getByUsername.mockResolvedValue(undefined);
      await controller.unblock(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should handle when status is not "blocked"', async () => {
      friendshipRepoMock.getStatus.mockResolvedValue("accepted");
      userRepoMock.getByUsername.mockResolvedValue(user2Data as UserData);
      await controller.unblock(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should handle success', async () => {
      friendshipRepoMock.getStatus.mockResolvedValue("blocked");
      userRepoMock.getByUsername.mockResolvedValue(user2Data as UserData);
      await controller.unblock(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });
});
