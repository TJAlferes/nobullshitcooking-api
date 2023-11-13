import type { Request, Response } from 'express';
import type { Session, SessionData } from 'express-session';

import { UserRepo } from '../repo';
import type { UserData } from '../repo';
import { friendshipController as controller } from './controller';
import { FriendshipRepo } from './repo';

class NotFoundExceptionMock extends Error {}
class ForbiddenExceptionMock extends Error {}
jest.mock('../../../utils/exceptions', () => ({
  NotFoundException: jest.fn(() => new NotFoundExceptionMock()),
  ForbiddenException: jest.fn(() => new ForbiddenExceptionMock())
}));
jest.mock('../repo');
jest.mock('./repo');

let userRepoMock = UserRepo as unknown as jest.Mocked<UserRepo>;
let friendshipRepoMock = FriendshipRepo as unknown as jest.Mocked<FriendshipRepo>;

interface MockRequest extends Request {
  session: Session & Partial<SessionData>;
}

describe('friendshipController', () => {
  const user2Data = {
    user_id: '2',
    email: 'user2@nobsc.com',
    username: "user2",
    confirmation_code: "2"
  };
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    //jest.clearAllMocks();
    userRepoMock = UserRepo as unknown as jest.Mocked<UserRepo>;
    friendshipRepoMock = FriendshipRepo as unknown as jest.Mocked<FriendshipRepo>;
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
    it('handles when desired friend does not exist', async () => {
      userRepoMock.getByUsername.mockResolvedValue(undefined);
      expect(() => controller.create(<Request>req, <Response>res))
        .toThrow(NotFoundExceptionMock);
    });

    it('handles when blocked by desired friend', async () => {
      friendshipRepoMock.getStatus.mockResolvedValue("blocked");
      userRepoMock.getByUsername.mockResolvedValue(user2Data as UserData);
      req.body.friendname = 'user2';
      //await controller.create(<Request>req, <Response>res);
      //expect(res.status).toHaveBeenCalledWith(404);
      expect(() => controller.create(<Request>req, <Response>res))
        .toThrow(NotFoundExceptionMock);
    });

    it('handles success', async () => {
      friendshipRepoMock.getStatus.mockResolvedValue(undefined);
      userRepoMock.getByUsername.mockResolvedValue(user2Data as UserData);
      await controller.create(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('handles when status is "pending-sent"', async () => {
      friendshipRepoMock.getStatus
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce("pending-sent");
      userRepoMock.getByUsername.mockResolvedValue(user2Data as UserData);
      await controller.create(<Request>req, <Response>res);
      //expect(res.status).toHaveBeenCalledWith(403);
      //expect(res.json).toHaveBeenCalledWith({message: 'Already pending.'});
      expect(() => controller.create(<Request>req, <Response>res))
        .toThrow(ForbiddenExceptionMock);
    });

    it('handles when status is "pending-received"', async () => {
      friendshipRepoMock.getStatus
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce("pending-received");
      userRepoMock.getByUsername.mockResolvedValue(user2Data as UserData);
      await controller.create(<Request>req, <Response>res);
      //expect(res.status).toHaveBeenCalledWith(403);
      //expect(res.json).toHaveBeenCalledWith({message: 'Already pending.'});
      expect(() => controller.create(<Request>req, <Response>res))
        .toThrow(ForbiddenExceptionMock);
    });

    it('handles when status is "accepted"', async () => {
      friendshipRepoMock.getStatus
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce("accepted");
      userRepoMock.getByUsername.mockResolvedValue(user2Data as UserData);
      await controller.create(<Request>req, <Response>res);
      //expect(res.status).toHaveBeenCalledWith(403);
      //expect(res.json).toHaveBeenCalledWith({message: 'Already friends.'});
      expect(() => controller.create(<Request>req, <Response>res))
        .toThrow(ForbiddenExceptionMock);
    });

    it('handles when status is "blocked"', async () => {
      friendshipRepoMock.getStatus
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce("blocked");
      userRepoMock.getByUsername.mockResolvedValue(user2Data as UserData);
      await controller.create(<Request>req, <Response>res);
      //expect(res.status).toHaveBeenCalledWith(403);
      //expect(res.json).toHaveBeenCalledWith({message: 'User blocked. First unblock.'});
      expect(() => controller.create(<Request>req, <Response>res))
        .toThrow(ForbiddenExceptionMock);
    });
  });

  describe('accept method', () => {
    it('handles when desired friend does not exist', async () => {
      userRepoMock.getByUsername.mockResolvedValue(undefined);
      await controller.accept(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('handles when status is not "pending-received"', async () => {
      friendshipRepoMock.getStatus.mockResolvedValue("blocked");
      userRepoMock.getByUsername.mockResolvedValue(user2Data as UserData);
      await controller.accept(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('handles success', async () => {
      userRepoMock.getByUsername.mockResolvedValue(user2Data as UserData);
      await controller.accept(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });

  describe('reject method', () => {
    it('handles when desired friend does not exist', async () => {
      userRepoMock.getByUsername.mockResolvedValue(undefined);
      await controller.reject(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('handles when status is not "pending-received"', async () => {
      friendshipRepoMock.getStatus.mockResolvedValue("blocked");
      userRepoMock.getByUsername.mockResolvedValue(user2Data as UserData);
      await controller.reject(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('handles success', async () => {
      userRepoMock.getByUsername.mockResolvedValue(user2Data as UserData);
      await controller.reject(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });

  describe('delete method', () => {
    it('handles when target friend does not exist', async () => {
      userRepoMock.getByUsername.mockResolvedValue(undefined);
      await controller.delete(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('handles when status is not "accepted"', async () => {
      friendshipRepoMock.getStatus.mockResolvedValue("blocked");
      userRepoMock.getByUsername.mockResolvedValue(user2Data as UserData);
      await controller.delete(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('handles success', async () => {
      userRepoMock.getByUsername.mockResolvedValue(user2Data as UserData);
      await controller.delete(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });

  describe('block method', () => {
    it('handles when desired friend does not exist', async () => {
      userRepoMock.getByUsername.mockResolvedValue(undefined);
      await controller.block(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('handles success', async () => {
      userRepoMock.getByUsername.mockResolvedValue(user2Data as UserData);
      await controller.block(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });

  describe('unblock method', () => {
    it('handles when target user does not exist', async () => {
      userRepoMock.getByUsername.mockResolvedValue(undefined);
      await controller.unblock(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('handles when status is not "blocked"', async () => {
      friendshipRepoMock.getStatus.mockResolvedValue("accepted");
      userRepoMock.getByUsername.mockResolvedValue(user2Data as UserData);
      await controller.unblock(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('handles success', async () => {
      friendshipRepoMock.getStatus.mockResolvedValue("blocked");
      userRepoMock.getByUsername.mockResolvedValue(user2Data as UserData);
      await controller.unblock(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });
});
