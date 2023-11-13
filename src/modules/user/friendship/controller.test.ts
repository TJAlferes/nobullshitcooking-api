import type { Request, Response } from 'express';
import type { Session, SessionData } from 'express-session';

import { ExceptionError, NotFoundException, ForbiddenException } from '../../../utils/exceptions';
import { UserRepo } from '../repo';
import type { UserData } from '../repo';
import { FriendshipRepo } from './repo';
import { friendshipController as controller } from './controller';

//let NotFoundExceptionMock = jest.fn();
//let ForbiddenExceptionMock = jest.fn();
//jest.mock('../../../utils/exceptions', () => ({
//  ExceptionError: jest.fn((code, name, message) => ({
//    code,
//    name,
//    message,
//    toString: jest.fn(() => JSON.stringify({code, name, message})),
//  })),
//  NotFoundException: jest.fn().mockImplementation(() => NotFoundExceptionMock),
//  ForbiddenException: jest.fn().mockImplementation(() => ForbiddenExceptionMock)
//}));

let mockGetByUsername = jest.fn();
jest.mock('../repo', () => ({
  UserRepo: jest.fn().mockImplementation(() => ({
    getByUsername: mockGetByUsername
  }))
}));

let mockGetStatus = jest.fn();
let mockInsert = jest.fn();
let mockUpdate = jest.fn();
let mockDelete = jest.fn();
jest.mock('./repo', () => ({
  FriendshipRepo: jest.fn().mockImplementation(() => ({
    getStatus: mockGetStatus,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete
  }))
}));

interface MockRequest extends Request {
  params: any;
  session: Session & Partial<SessionData>;
}

describe('friendshipController', () => {
  const user2Data = {
    user_id: '44444444-4444-4444-4444-444444444444',
    email: 'fakeuser2@gmail.com.com',
    username: 'fakeuser2',
    confirmation_code: '44444444-4444-4444-4444-444444444444'
  };
  let req: Partial<MockRequest>;
  let res: Partial<Response>;

  beforeEach(() => {
    //jest.clearAllMocks();
    req = {
      params: {
        friendname: 'fakeuser2'
      },
      session: {
        user_id: '33333333-3333-3333-3333-333333333333'
      }
    } as MockRequest;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create method', () => {
    it('handles success', async () => {
      mockGetStatus.mockResolvedValue(undefined);
      mockGetByUsername.mockResolvedValue(user2Data as UserData);
      await controller.create(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('handles when desired friend does not exist', async () => {
      mockGetByUsername.mockResolvedValue(undefined);
      await expect(async () => await controller.create(req as Request, res as Response))
        .rejects
        .toThrow();
    });

    it('handles when blocked by desired friend', async () => {
      mockGetStatus.mockResolvedValue('blocked');
      mockGetByUsername.mockResolvedValue(user2Data as UserData);
      //req.params.friendname = 'fakeuser2';
      try {
        await controller.create(<Request>req, <Response>res);
      } catch (err: any) {
        expect(err.code).toBe(404);
        expect(err.message).toBe('Not Found');
      }
    });

    it('handles when status is pending-sent', async () => {
      mockGetStatus
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce('pending-sent');
      mockGetByUsername.mockResolvedValue(user2Data as UserData);
      try {
        await controller.create(<Request>req, <Response>res);
      } catch (err: any) {
        expect(err.code).toBe(403);
        expect(err.message).toBe('Already pending.');
      }
    });

    it('handles when status is pending-received', async () => {
      mockGetStatus
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce('pending-received');
      mockGetByUsername.mockResolvedValue(user2Data as UserData);
      try {
        await controller.create(<Request>req, <Response>res);
      } catch (err: any) {
        expect(err.code).toBe(403);
        expect(err.message).toBe('Already pending.');
      }
    });

    it('handles when status is accepted', async () => {
      mockGetStatus
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce('accepted');
      mockGetByUsername.mockResolvedValue(user2Data as UserData);
      try {
        await controller.create(<Request>req, <Response>res);
      } catch (err: any) {
        expect(err.code).toBe(403);
        expect(err.message).toBe('Already friends.');
      }
    });

    it('handles when status is blocked', async () => {
      mockGetStatus
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce('blocked');
      mockGetByUsername.mockResolvedValue(user2Data as UserData);
      try {
        await controller.create(<Request>req, <Response>res);
      } catch (err: any) {
        expect(err.code).toBe(403);
        expect(err.message).toBe('User blocked. First unblock.');
      }
    });
  });

  describe('accept method', () => {
    it('handles when desired friend does not exist', async () => {
      mockGetByUsername.mockResolvedValue(undefined);
      await controller.accept(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('handles when status is not pending-received', async () => {
      mockGetStatus.mockResolvedValue('blocked');
      mockGetByUsername.mockResolvedValue(user2Data as UserData);
      await controller.accept(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('handles success', async () => {
      mockGetByUsername.mockResolvedValue(user2Data as UserData);
      await controller.accept(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });

  describe('reject method', () => {
    it('handles when desired friend does not exist', async () => {
      mockGetByUsername.mockResolvedValue(undefined);
      await controller.reject(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('handles when status is not pending-received', async () => {
      mockGetStatus.mockResolvedValue('blocked');
      mockGetByUsername.mockResolvedValue(user2Data as UserData);
      await controller.reject(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('handles success', async () => {
      mockGetByUsername.mockResolvedValue(user2Data as UserData);
      await controller.reject(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });

  describe('delete method', () => {
    it('handles when target friend does not exist', async () => {
      mockGetByUsername.mockResolvedValue(undefined);
      await controller.delete(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('handles when status is not accepted', async () => {
      mockGetStatus.mockResolvedValue('blocked');
      mockGetByUsername.mockResolvedValue(user2Data as UserData);
      await controller.delete(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('handles success', async () => {
      mockGetByUsername.mockResolvedValue(user2Data as UserData);
      await controller.delete(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });

  describe('block method', () => {
    it('handles when desired friend does not exist', async () => {
      mockGetByUsername.mockResolvedValue(undefined);
      await controller.block(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('handles success', async () => {
      mockGetByUsername.mockResolvedValue(user2Data as UserData);
      await controller.block(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });

  describe('unblock method', () => {
    it('handles when target user does not exist', async () => {
      mockGetByUsername.mockResolvedValue(undefined);
      await controller.unblock(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('handles when status is not blocked', async () => {
      mockGetStatus.mockResolvedValue('accepted');
      mockGetByUsername.mockResolvedValue(user2Data as UserData);
      await controller.unblock(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('handles success', async () => {
      mockGetStatus.mockResolvedValue('blocked');
      mockGetByUsername.mockResolvedValue(user2Data as UserData);
      await controller.unblock(<Request>req, <Response>res);
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });
});
