import { Request, Response } from 'express';
import { assert } from 'superstruct';

import {
  validFriendshipEntity
} from '../../lib/validations/friendship/friendshipEntity';
import { userFriendshipController } from './friendship';

jest.mock('superstruct');

jest.mock('../../mysql-access/Friendship', () => {
  const originalModule = jest.requireActual('../../mysql-access/Friendship');
  return {
    ...originalModule,
    Friendship: jest.fn().mockImplementation(() => ({
      getByFriendId:  mockGetByFriendId,
      checkIfBlockedBy:  mockCheckIfBlockedBy,
      view: mockView,
      create: mockCreate,
      accept: mockAccept,
      reject: mockReject,
      delete: mockDelete,
      block: mockBlock,
      unblock: mockUnblock
    }))
  };
});
let mockGetByFriendId = jest.fn();
let mockCheckIfBlockedBy = jest.fn();
let mockView = jest.fn();
let mockCreate = jest.fn();
let mockAccept = jest.fn();
let mockReject = jest.fn();
let mockDelete = jest.fn();
let mockBlock = jest.fn();
let mockUnblock = jest.fn();

jest.mock('../../mysql-access/User', () => {
  const originalModule = jest.requireActual('../../mysql-access/User');
  return {
    ...originalModule,
    User: jest.fn().mockImplementation(() => ({viewByName: mockViewByName}))
  };
});
let mockViewByName = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('user friendship controller', () => {
  const session = {...<Express.Session>{}, userInfo: {id: 150}};

  describe('view method', () => {
    const rows = [{id: 1, name: "Name"}];
    const req: Partial<Request> = {session};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses view correctly', async () => {
      mockView = jest.fn().mockResolvedValue([rows]);
      await userFriendshipController.view(<Request>req, <Response>res);
      expect(mockView).toHaveBeenCalledWith(150);
    });

    it('sends data correctly', async () => {
      mockView = jest.fn().mockResolvedValue([rows]);
      await userFriendshipController.view(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith([rows]);
    });

    it('returns correctly', async () => {
      mockView = jest.fn().mockResolvedValue([rows]);
      const actual =
        await userFriendshipController.view(<Request>req, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });

  describe('create method', () => {

    describe('when desired friend does not exist', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'User not found.'})
      };

      it('uses viewByName correctly', async () => {
        mockViewByName = jest.fn().mockResolvedValue([[]]);
        await userFriendshipController.create(<Request>req, <Response>res);
        expect(mockViewByName).toHaveBeenCalledWith("Name");
      });

      it('sends data correctly', async () => {
        mockViewByName = jest.fn().mockResolvedValue([[]]);
        await userFriendshipController.create(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message: 'User not found.'});
      });
  
      it('returns correctly', async () => {
        mockViewByName = jest.fn().mockResolvedValue([[]]);
        const actual =
          await userFriendshipController.create(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'User not found.'});
      });
    });

    describe('when blocked by desired friend', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'User not found.'})
      };

      it('uses checkIfBlockedBy correctly', async () => {
        mockCheckIfBlockedBy =
          jest.fn().mockResolvedValue([[{user_id: 150, friend_id: 42}]]);
        mockViewByName =
          jest.fn().mockResolvedValue([[{id: 42, avatar: "NameXYZ"}]]);
        await userFriendshipController.create(<Request>req, <Response>res);
        expect(mockCheckIfBlockedBy).toHaveBeenCalledWith(150, 42);
      });

      it('sends data correctly', async () => {
        mockCheckIfBlockedBy =
          jest.fn().mockResolvedValue([[{user_id: 150, friend_id: 42}]]);
        mockViewByName =
          jest.fn().mockResolvedValue([[{id: 42, avatar: "NameXYZ"}]]);
        await userFriendshipController.create(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message: 'User not found.'});
      });
  
      it('returns correctly', async () => {
        mockCheckIfBlockedBy =
          jest.fn().mockResolvedValue([[{user_id: 150, friend_id: 42}]]);
        mockViewByName =
          jest.fn().mockResolvedValue([[{id: 42, avatar: "NameXYZ"}]]);
        const actual =
          await userFriendshipController.create(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'User not found.'});
      });
    });

    describe('when friendship does not already exist', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({
          message: 'Friendship request sent.'
        })
      };

      it ('uses getFriendshipByFriendId correctly', async () => {
        mockCheckIfBlockedBy = jest.fn().mockResolvedValue([[]]);
        mockGetByFriendId = jest.fn().mockResolvedValue([[]]);
        mockViewByName = jest.fn().mockResolvedValue([
          [{id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController.create(<Request>req, <Response>res);
        expect(mockGetByFriendId).toHaveBeenCalledWith(150, 42);
      });

      it('uses assert correctly', async () => {
        mockCheckIfBlockedBy = jest.fn().mockResolvedValue([[]]);
        mockGetByFriendId = jest.fn().mockResolvedValue([[]]);
        mockViewByName = jest.fn().mockResolvedValue([
          [{id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController.create(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {
            userId: 150,
            friendId: 42,
            status1: "pending-sent",
            status2: "pending-received"
          },
          validFriendshipEntity
        );
      });

      it('uses create correctly', async () => {
        mockCheckIfBlockedBy = jest.fn().mockResolvedValue([[]]);
        mockGetByFriendId = jest.fn().mockResolvedValue([[]]);
        mockViewByName = jest.fn().mockResolvedValue([
          [{id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController.create(<Request>req, <Response>res);
        expect(mockCreate).toHaveBeenCalledTimes(1);
      });

      it('sends data correctly', async () => {
        mockCheckIfBlockedBy = jest.fn().mockResolvedValue([[]]);
        mockGetByFriendId = jest.fn().mockResolvedValue([[]]);
        mockViewByName = jest.fn().mockResolvedValue([
          [{id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController.create(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message: 'Friendship request sent.'});
      });
  
      it('returns correctly', async () => {
        mockCheckIfBlockedBy = jest.fn().mockResolvedValue([[]]);
        mockGetByFriendId = jest.fn().mockResolvedValue([[]]);
        mockViewByName = jest.fn().mockResolvedValue([
          [{id: 42, avatar: "NameXYZ"}]
        ]);
        const actual =
          await userFriendshipController.create(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Friendship request sent.'});
      });
    });

    describe('when status is pending-sent', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'Already sent.'})
      };

      it('sends data correctly', async () => {
        mockCheckIfBlockedBy = jest.fn().mockResolvedValue([[]]);
        mockGetByFriendId =  jest.fn().mockResolvedValue([
          [{user_id: 150, friend_id: 42, status: "pending-sent"}]
        ]);
        mockViewByName = jest.fn().mockResolvedValue([
          [{id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController.create(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message: 'Already sent.'});
      });
  
      it('returns correctly', async () => {
        mockCheckIfBlockedBy = jest.fn().mockResolvedValue([[]]);
        mockGetByFriendId = jest.fn().mockResolvedValue([
          [{user_id: 150, friend_id: 42, status: "pending-sent"}]
        ]);
        mockViewByName = jest.fn().mockResolvedValue([
          [{id: 42, avatar: "NameXYZ"}]
        ]);
        const actual =
          await userFriendshipController.create(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Already sent.'});
      });
    });

    describe('when status is pending-received', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'Already received.'})
      };

      it('sends data correctly', async () => {
        mockCheckIfBlockedBy = jest.fn().mockResolvedValue([[]]);
        mockGetByFriendId =  jest.fn().mockResolvedValue([
          [{user_id: 150, friend_id: 42, status: "pending-received"}]
        ]);
        mockViewByName = jest.fn().mockResolvedValue([
          [{id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController.create(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message: 'Already received.'});
      });
  
      it('returns correctly', async () => {
        mockCheckIfBlockedBy = jest.fn().mockResolvedValue([[]]);
        mockGetByFriendId =  jest.fn().mockResolvedValue([
          [{user_id: 150, friend_id: 42, status: "pending-received"}]
        ]);
        mockViewByName = jest.fn().mockResolvedValue([
          [{id: 42, avatar: "NameXYZ"}]
        ]);
        const actual =
          await userFriendshipController.create(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Already received.'});
      });
    });

    describe('when status is accepted', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'Already friends.'})
      };

      it('sends data correctly', async () => {
        mockCheckIfBlockedBy = jest.fn().mockResolvedValue([[]]);
        mockGetByFriendId =  jest.fn().mockResolvedValue([
          [{user_id: 150, friend_id: 42, status: "accepted"}]
        ]);
        mockViewByName = jest.fn().mockResolvedValue([
          [{id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController.create(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message: 'Already friends.'});
      });
  
      it('returns correctly', async () => {
        mockCheckIfBlockedBy = jest.fn().mockResolvedValue([[]]);
        mockGetByFriendId =  jest.fn().mockResolvedValue([
          [{user_id: 150, friend_id: 42, status: "accepted"}]
        ]);
        mockViewByName = jest.fn().mockResolvedValue([
          [{id: 42, avatar: "NameXYZ"}]
        ]);
        const actual =
          await userFriendshipController.create(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Already friends.'});
      });
    });

    describe('when status is blocked', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({
          message: 'User blocked. First unblock.'
        })
      };

      it('sends data correctly', async () => {
        mockCheckIfBlockedBy = jest.fn().mockResolvedValue([[]]);
        mockGetByFriendId =  jest.fn().mockResolvedValue([
          [{user_id: 150, friend_id: 42, status: "blocked"}]
        ]);
        mockViewByName = jest.fn().mockResolvedValue([
          [{id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController.create(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({
          message: 'User blocked. First unblock.'
        });
      });

      it('returns correctly', async () => {
        mockCheckIfBlockedBy = jest.fn().mockResolvedValue([[]]);
        mockGetByFriendId =  jest.fn().mockResolvedValue([
          [{user_id: 150, friend_id: 42, status: "blocked"}]
        ]);
        mockViewByName = jest.fn().mockResolvedValue([
          [{id: 42, avatar: "NameXYZ"}]
        ]);
        const actual =
          await userFriendshipController.create(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'User blocked. First unblock.'});
      });
    });

  });

  describe('accept method', () => {

    describe('when desired friend does not exist', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'User not found.'})
      };

      it('uses viewByName correctly', async () => {
        mockViewByName = jest.fn().mockResolvedValue([[]]);
        await userFriendshipController.accept(<Request>req, <Response>res);
        expect(mockViewByName).toHaveBeenCalledWith("Name");
      });

      it('sends data correctly', async () => {
        mockViewByName = jest.fn().mockResolvedValue([[]]);
        await userFriendshipController.accept(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message: 'User not found.'});
      });
  
      it('returns correctly', async () => {
        mockViewByName = jest.fn().mockResolvedValue([[]]);
        const actual =
          await userFriendshipController.accept(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'User not found.'});
      });
    });

    describe('when desired friend exists', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({
          message: 'Friendship request accepted.'
        })
      };

      it('uses viewByName correctly', async () => {
        mockViewByName = jest.fn().mockResolvedValue([
          [{id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController.accept(<Request>req, <Response>res);
        expect(mockViewByName).toHaveBeenCalledWith("Name");
      });

      it('uses accept correctly', async () => {
        mockViewByName = jest.fn().mockResolvedValue([
          [{id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController.accept(<Request>req, <Response>res);
        expect(mockAccept).toHaveBeenCalledWith(150, 42);
      });

      it('sends data correctly', async () => {
        mockViewByName = jest.fn().mockResolvedValue([
          [{id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController.accept(<Request>req, <Response>res);
        expect(res.send)
          .toHaveBeenCalledWith({message: 'Friendship request accepted.'});
      });
  
      it('returns correctly', async () => {
        mockViewByName = jest.fn().mockResolvedValue([
          [{id: 42, avatar: "NameXYZ"}]
        ]);
        const actual =
          await userFriendshipController.accept(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Friendship request accepted.'});
      });
    });

  });

  describe('reject method', () => {

    describe('when desired friend does not exist', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'User not found.'})
      };

      it('uses viewByName correctly', async () => {
        mockViewByName = jest.fn().mockResolvedValue([[]]);
        await userFriendshipController.reject(<Request>req, <Response>res);
        expect(mockViewByName).toHaveBeenCalledWith("Name");
      });

      it('sends data correctly', async () => {
        mockViewByName = jest.fn().mockResolvedValue([[]]);
        await userFriendshipController.reject(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message: 'User not found.'});
      });
  
      it('returns correctly', async () => {
        mockViewByName = jest.fn().mockResolvedValue([[]]);
        const actual =
          await userFriendshipController.reject(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'User not found.'});
      });
    });

    describe('when desired friend exists', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({
          message: 'Friendship request rejected.'
        })
      };

      it('uses viewByName correctly', async () => {
        mockViewByName = jest.fn().mockResolvedValue([
          [{id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController.reject(<Request>req, <Response>res);
        expect(mockViewByName).toHaveBeenCalledWith("Name");
      });

      it('uses reject correctly', async () => {
        mockViewByName = jest.fn().mockResolvedValue([
          [{id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController.reject(<Request>req, <Response>res);
        expect(mockReject).toHaveBeenCalledWith(150, 42);
      });

      it('sends data correctly', async () => {
        mockViewByName = jest.fn().mockResolvedValue([
          [{id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController.reject(<Request>req, <Response>res);
        expect(res.send)
        .toHaveBeenCalledWith({message: 'Friendship request rejected.'});
      });
  
      it('returns correctly', async () => {
        mockViewByName = jest.fn().mockResolvedValue([
          [{id: 42, avatar: "NameXYZ"}]
        ]);
        const actual =
          await userFriendshipController.reject(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Friendship request rejected.'});
      });
    });

  });

  describe('delete method', () => {

    describe('when desired friend does not exist', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'User not found.'})
      };

      it('uses viewByName correctly', async () => {
        mockViewByName = jest.fn().mockResolvedValue([[]]);
        await userFriendshipController.delete(<Request>req, <Response>res);
        expect(mockViewByName).toHaveBeenCalledWith("Name");
      });

      it('sends data correctly', async () => {
        mockViewByName = jest.fn().mockResolvedValue([[]]);
        await userFriendshipController.delete(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message: 'User not found.'});
      });
  
      it('returns correctly', async () => {
        mockViewByName = jest.fn().mockResolvedValue([[]]);
        const actual =
          await userFriendshipController.delete(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'User not found.'});
      });
    });

    describe('when desired friend exists', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({
          message: 'No longer friends. Maybe again later.'
        })
      };

      it('uses viewByName correctly', async () => {
        mockViewByName = jest.fn().mockResolvedValue([
          [{id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController.delete(<Request>req, <Response>res);
        expect(mockViewByName).toHaveBeenCalledWith("Name");
      });

      it('uses delete correctly', async () => {
        mockViewByName = jest.fn().mockResolvedValue([
          [{id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController.delete(<Request>req, <Response>res);
        expect(mockDelete).toHaveBeenCalledWith(150, 42);
      });

      it('sends data correctly', async () => {
        mockViewByName = jest.fn().mockResolvedValue([
          [{id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController.delete(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({
          message: 'No longer friends. Maybe again later.'
        });
      });
  
      it('returns correctly', async () => {
        mockViewByName = jest.fn().mockResolvedValue([
          [{id: 42, avatar: "NameXYZ"}]
        ]);
        const actual =
          await userFriendshipController.delete(<Request>req, <Response>res);
        expect(actual)
          .toEqual({message: 'No longer friends. Maybe again later.'});
      });
    });

  });

  describe('block method', () => {

    describe('when desired friend does not exist', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'User not found.'})
      };

      it('uses viewByName correctly', async () => {
        mockViewByName = jest.fn().mockResolvedValue([[]]);
        await userFriendshipController.block(<Request>req, <Response>res);
        expect(mockViewByName).toHaveBeenCalledWith("Name");
      });

      it('sends data correctly', async () => {
        mockViewByName = jest.fn().mockResolvedValue([[]]);
        await userFriendshipController.block(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message: 'User not found.'});
      });
  
      it('returns correctly', async () => {
        mockViewByName = jest.fn().mockResolvedValue([[]]);
        const actual =
          await userFriendshipController.block(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'User not found.'});
      });
    });

    describe('when desired friend exists', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'User blocked.'})
      };

      it('uses viewByName correctly', async () => {
        mockViewByName = jest.fn().mockResolvedValue([
          [{id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController.block(<Request>req, <Response>res);
        expect(mockViewByName).toHaveBeenCalledWith("Name");
      });

      it('uses block correctly', async () => {
        mockViewByName = jest.fn().mockResolvedValue([
          [{id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController.block(<Request>req, <Response>res);
        expect(mockBlock).toHaveBeenCalledWith(150, 42);
      });

      it('sends data correctly', async () => {
        mockViewByName = jest.fn().mockResolvedValue([
          [{id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController.block(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message: 'User blocked.'});
      });
  
      it('returns correctly', async () => {
        mockViewByName = jest.fn().mockResolvedValue([
          [{id: 42, avatar: "NameXYZ"}]
        ]);
        const actual =
          await userFriendshipController.block(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'User blocked.'});
      });
    });

  });

  describe('unblock method', () => {

    describe('when desired friend does not exist', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'User not found.'})
      };

      it('uses viewByName correctly', async () => {
        mockViewByName = jest.fn().mockResolvedValue([[]]);
        await userFriendshipController.unblock(<Request>req, <Response>res);
        expect(mockViewByName).toHaveBeenCalledWith("Name");
      });

      it('sends data correctly', async () => {
        mockViewByName = jest.fn().mockResolvedValue([[]]);
        await userFriendshipController.unblock(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message: 'User not found.'});
      });
  
      it('returns correctly', async () => {
        mockViewByName = jest.fn().mockResolvedValue([[]]);
        const actual =
          await userFriendshipController.unblock(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'User not found.'});
      });
    });

    describe('when desired friend exists', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'User unblocked.'})
      };

      it('uses viewByName correctly', async () => {
        mockViewByName = jest.fn().mockResolvedValue([
          [{id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController.unblock(<Request>req, <Response>res);
        expect(mockViewByName).toHaveBeenCalledWith("Name");
      });

      it('uses unblock correctly', async () => {
        mockViewByName = jest.fn().mockResolvedValue([
          [{id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController.unblock(<Request>req, <Response>res);
        expect(mockUnblock).toHaveBeenCalledWith(150, 42);
      });

      it('sends data correctly', async () => {
        mockViewByName = jest.fn().mockResolvedValue([
          [{id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController.unblock(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message: 'User unblocked.'});
      });
  
      it('returns correctly', async () => {
        mockViewByName = jest.fn().mockResolvedValue([
          [{id: 42, avatar: "NameXYZ"}]
        ]);
        const actual =
          await userFriendshipController.unblock(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'User unblocked.'});
      });
    });

  });
});