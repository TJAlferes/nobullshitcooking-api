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
      getFriendshipByFriendId:  mockGetFriendshipByFriendId,
      checkIfBlockedBy:  mockCheckIfBlockedBy,
      viewMyFriendships: mockViewMyFriendships,
      createFriendship: mockCreateFriendship,
      acceptFriendship: mockAcceptFriendship,
      rejectFriendship: mockRejectFriendship,
      deleteFriendship: mockDeleteFriendship,
      blockUser: mockBlockUser,
      unblockUser: mockUnblockUser
    }))
  };
});
let mockGetFriendshipByFriendId = jest.fn();
let mockCheckIfBlockedBy = jest.fn();
let mockViewMyFriendships = jest.fn();
let mockCreateFriendship = jest.fn();
let mockAcceptFriendship = jest.fn();
let mockRejectFriendship = jest.fn();
let mockDeleteFriendship = jest.fn();
let mockBlockUser = jest.fn();
let mockUnblockUser = jest.fn();

jest.mock('../../mysql-access/User', () => {
  const originalModule = jest.requireActual('../../mysql-access/User');
  return {
    ...originalModule,
    User: jest.fn().mockImplementation(() => ({
      viewUserByName: mockViewUserByName
    }))
  };
});
let mockViewUserByName = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('user friendship controller', () => {
  const session = {...<Express.Session>{}, userInfo: {userId: 150}};

  describe('viewMyFriendships method', () => {
    const rows = [{id: 1, name: "Name"}];
    const req: Partial<Request> = {session};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses viewMyFriendships correctly', async () => {
      mockViewMyFriendships = jest.fn().mockResolvedValue([rows]);
      await userFriendshipController
      .viewMyFriendships(<Request>req, <Response>res);
      expect(mockViewMyFriendships).toHaveBeenCalledWith(150);
    });

    it('sends data correctly', async () => {
      mockViewMyFriendships = jest.fn().mockResolvedValue([rows]);
      await userFriendshipController
      .viewMyFriendships(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith([rows]);
    });

    it('returns correctly', async () => {
      mockViewMyFriendships = jest.fn().mockResolvedValue([rows]);
      const actual = await userFriendshipController
      .viewMyFriendships(<Request>req, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });

  describe('createFriendship method', () => {

    describe('when desired friend does not exist', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'User not found.'})
      };

      it('uses viewUserByName correctly', async () => {
        mockViewUserByName = jest.fn().mockResolvedValue([[]]);
        await userFriendshipController
        .createFriendship(<Request>req, <Response>res);
        expect(mockViewUserByName).toBeCalledWith("Name");
      });

      it('sends data correctly', async () => {
        mockViewUserByName = jest.fn().mockResolvedValue([[]]);
        await userFriendshipController
        .createFriendship(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({message: 'User not found.'});
      });
  
      it('returns correctly', async () => {
        mockViewUserByName = jest.fn().mockResolvedValue([[]]);
        const actual = await userFriendshipController
        .createFriendship(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'User not found.'});
      });
    });

    describe('when blocked by desired friend', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'User not found.'})
      };

      it('uses checkIfBlockedBy correctly', async () => {
        mockCheckIfBlockedBy = jest.fn().mockResolvedValue(
          [[{user_id: 150, friend_id: 42}]]
        );
        mockViewUserByName = jest.fn().mockResolvedValue([
          [{user_id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController
        .createFriendship(<Request>req, <Response>res);
        expect(mockCheckIfBlockedBy).toBeCalledWith(150, 42);
      });

      it('sends data correctly', async () => {
        mockCheckIfBlockedBy = jest.fn().mockResolvedValue(
          [[{user_id: 150, friend_id: 42}]]
        );
        mockViewUserByName = jest.fn().mockResolvedValue([
          [{user_id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController
        .createFriendship(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({message: 'User not found.'});
      });
  
      it('returns correctly', async () => {
        mockCheckIfBlockedBy = jest.fn().mockResolvedValue(
          [[{user_id: 150, friend_id: 42}]]
        );
        mockViewUserByName = jest.fn().mockResolvedValue([
          [{user_id: 42, avatar: "NameXYZ"}]
        ]);
        const actual = await userFriendshipController
        .createFriendship(<Request>req, <Response>res);
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
        mockGetFriendshipByFriendId = jest.fn().mockResolvedValue([[]]);
        mockViewUserByName = jest.fn().mockResolvedValue([
          [{user_id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController
        .createFriendship(<Request>req, <Response>res);
        expect(mockGetFriendshipByFriendId).toBeCalledWith(150, 42);
      });

      it('uses assert correctly', async () => {
        mockCheckIfBlockedBy = jest.fn().mockResolvedValue([[]]);
        mockGetFriendshipByFriendId = jest.fn().mockResolvedValue([[]]);
        mockViewUserByName = jest.fn().mockResolvedValue([
          [{user_id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController
        .createFriendship(<Request>req, <Response>res);
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

      it('uses createFriendship correctly', async () => {
        mockCheckIfBlockedBy = jest.fn().mockResolvedValue([[]]);
        mockGetFriendshipByFriendId = jest.fn().mockResolvedValue([[]]);
        mockViewUserByName = jest.fn().mockResolvedValue([
          [{user_id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController
        .createFriendship(<Request>req, <Response>res);
        expect(mockCreateFriendship).toHaveBeenCalledTimes(1);
      });

      it('sends data correctly', async () => {
        mockCheckIfBlockedBy = jest.fn().mockResolvedValue([[]]);
        mockGetFriendshipByFriendId = jest.fn().mockResolvedValue([[]]);
        mockViewUserByName = jest.fn().mockResolvedValue([
          [{user_id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController
        .createFriendship(<Request>req, <Response>res);
        expect(res.send)
        .toBeCalledWith({message: 'Friendship request sent.'});
      });
  
      it('returns correctly', async () => {
        mockCheckIfBlockedBy = jest.fn().mockResolvedValue([[]]);
        mockGetFriendshipByFriendId = jest.fn().mockResolvedValue([[]]);
        mockViewUserByName = jest.fn().mockResolvedValue([
          [{user_id: 42, avatar: "NameXYZ"}]
        ]);
        const actual = await userFriendshipController
        .createFriendship(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Friendship request sent.'});
      });
    });

    describe('when status is pending-sent', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({
          message: 'Already sent.'
        })
      };

      it('sends data correctly', async () => {
        mockCheckIfBlockedBy = jest.fn().mockResolvedValue([[]]);
        mockGetFriendshipByFriendId =  jest.fn().mockResolvedValue([
          [{user_id: 150, friend_id: 42, status: "pending-sent"}]
        ]);
        mockViewUserByName = jest.fn().mockResolvedValue([
          [{user_id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController
        .createFriendship(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({
          message: 'Already sent.'
        });
      });
  
      it('returns correctly', async () => {
        mockCheckIfBlockedBy = jest.fn().mockResolvedValue([[]]);
        mockGetFriendshipByFriendId = jest.fn().mockResolvedValue([
          [{user_id: 150, friend_id: 42, status: "pending-sent"}]
        ]);
        mockViewUserByName = jest.fn().mockResolvedValue([
          [{user_id: 42, avatar: "NameXYZ"}]
        ]);
        const actual = await userFriendshipController
        .createFriendship(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Already sent.'});
      });
    });

    describe('when status is pending-received', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({
          message: 'Already received.'
        })
      };

      it('sends data correctly', async () => {
        mockCheckIfBlockedBy = jest.fn().mockResolvedValue([[]]);
        mockGetFriendshipByFriendId =  jest.fn().mockResolvedValue([
          [{user_id: 150, friend_id: 42, status: "pending-received"}]
        ]);
        mockViewUserByName = jest.fn().mockResolvedValue([
          [{user_id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController
        .createFriendship(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({
          message: 'Already received.'
        });
      });
  
      it('returns correctly', async () => {
        mockCheckIfBlockedBy = jest.fn().mockResolvedValue([[]]);
        mockGetFriendshipByFriendId =  jest.fn().mockResolvedValue([
          [{user_id: 150, friend_id: 42, status: "pending-received"}]
        ]);
        mockViewUserByName = jest.fn().mockResolvedValue([
          [{user_id: 42, avatar: "NameXYZ"}]
        ]);
        const actual = await userFriendshipController
        .createFriendship(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Already received.'});
      });
    });

    describe('when status is accepted', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({
          message: 'Already friends.'
        })
      };

      it('sends data correctly', async () => {
        mockCheckIfBlockedBy = jest.fn().mockResolvedValue([[]]);
        mockGetFriendshipByFriendId =  jest.fn().mockResolvedValue([
          [{user_id: 150, friend_id: 42, status: "accepted"}]
        ]);
        mockViewUserByName = jest.fn().mockResolvedValue([
          [{user_id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController
        .createFriendship(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({
          message: 'Already friends.'
        });
      });
  
      it('returns correctly', async () => {
        mockCheckIfBlockedBy = jest.fn().mockResolvedValue([[]]);
        mockGetFriendshipByFriendId =  jest.fn().mockResolvedValue([
          [{user_id: 150, friend_id: 42, status: "accepted"}]
        ]);
        mockViewUserByName = jest.fn().mockResolvedValue([
          [{user_id: 42, avatar: "NameXYZ"}]
        ]);
        const actual = await userFriendshipController
        .createFriendship(<Request>req, <Response>res);
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
        mockGetFriendshipByFriendId =  jest.fn().mockResolvedValue([
          [{user_id: 150, friend_id: 42, status: "blocked"}]
        ]);
        mockViewUserByName = jest.fn().mockResolvedValue([
          [{user_id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController
        .createFriendship(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({
          message: 'User blocked. First unblock.'
        });
      });

      it('returns correctly', async () => {
        mockCheckIfBlockedBy = jest.fn().mockResolvedValue([[]]);
        mockGetFriendshipByFriendId =  jest.fn().mockResolvedValue([
          [{user_id: 150, friend_id: 42, status: "blocked"}]
        ]);
        mockViewUserByName = jest.fn().mockResolvedValue([
          [{user_id: 42, avatar: "NameXYZ"}]
        ]);
        const actual = await userFriendshipController
        .createFriendship(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'User blocked. First unblock.'});
      });
    });

  });

  describe('acceptFriendship method', () => {

    describe('when desired friend does not exist', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'User not found.'})
      };

      it('uses viewUserByName correctly', async () => {
        mockViewUserByName = jest.fn().mockResolvedValue([[]]);
        await userFriendshipController
        .acceptFriendship(<Request>req, <Response>res);
        expect(mockViewUserByName).toBeCalledWith("Name");
      });

      it('sends data correctly', async () => {
        mockViewUserByName = jest.fn().mockResolvedValue([[]]);
        await userFriendshipController
        .acceptFriendship(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({message: 'User not found.'});
      });
  
      it('returns correctly', async () => {
        mockViewUserByName = jest.fn().mockResolvedValue([[]]);
        const actual = await userFriendshipController
        .acceptFriendship(<Request>req, <Response>res);
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

      it('uses viewUserByName correctly', async () => {
        mockViewUserByName = jest.fn().mockResolvedValue([
          [{user_id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController
        .acceptFriendship(<Request>req, <Response>res);
        expect(mockViewUserByName).toBeCalledWith("Name");
      });

      it('uses acceptFriendship correctly', async () => {
        mockViewUserByName = jest.fn().mockResolvedValue([
          [{user_id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController
        .acceptFriendship(<Request>req, <Response>res);
        expect(mockAcceptFriendship).toBeCalledWith(150, 42);
      });

      it('sends data correctly', async () => {
        mockViewUserByName = jest.fn().mockResolvedValue([
          [{user_id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController
        .acceptFriendship(<Request>req, <Response>res);
        expect(res.send)
        .toBeCalledWith({message: 'Friendship request accepted.'});
      });
  
      it('returns correctly', async () => {
        mockViewUserByName = jest.fn().mockResolvedValue([
          [{user_id: 42, avatar: "NameXYZ"}]
        ]);
        const actual = await userFriendshipController
        .acceptFriendship(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Friendship request accepted.'});
      });
    });

  });

  describe('rejectFriendship method', () => {

    describe('when desired friend does not exist', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'User not found.'})
      };

      it('uses viewUserByName correctly', async () => {
        mockViewUserByName = jest.fn().mockResolvedValue([[]]);
        await userFriendshipController
        .rejectFriendship(<Request>req, <Response>res);
        expect(mockViewUserByName).toBeCalledWith("Name");
      });

      it('sends data correctly', async () => {
        mockViewUserByName = jest.fn().mockResolvedValue([[]]);
        await userFriendshipController
        .rejectFriendship(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({message: 'User not found.'});
      });
  
      it('returns correctly', async () => {
        mockViewUserByName = jest.fn().mockResolvedValue([[]]);
        const actual = await userFriendshipController
        .rejectFriendship(<Request>req, <Response>res);
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

      it('uses viewUserByName correctly', async () => {
        mockViewUserByName = jest.fn().mockResolvedValue([
          [{user_id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController
        .rejectFriendship(<Request>req, <Response>res);
        expect(mockViewUserByName).toBeCalledWith("Name");
      });

      it('uses rejectFriendship correctly', async () => {
        mockViewUserByName = jest.fn().mockResolvedValue([
          [{user_id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController
        .rejectFriendship(<Request>req, <Response>res);
        expect(mockRejectFriendship).toBeCalledWith(150, 42);
      });

      it('sends data correctly', async () => {
        mockViewUserByName = jest.fn().mockResolvedValue([
          [{user_id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController
        .rejectFriendship(<Request>req, <Response>res);
        expect(res.send)
        .toBeCalledWith({message: 'Friendship request rejected.'});
      });
  
      it('returns correctly', async () => {
        mockViewUserByName = jest.fn().mockResolvedValue([
          [{user_id: 42, avatar: "NameXYZ"}]
        ]);
        const actual = await userFriendshipController
        .rejectFriendship(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Friendship request rejected.'});
      });
    });

  });

  describe('deleteFriendship method', () => {

    describe('when desired friend does not exist', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'User not found.'})
      };

      it('uses viewUserByName correctly', async () => {
        mockViewUserByName = jest.fn().mockResolvedValue([[]]);
        await userFriendshipController
        .deleteFriendship(<Request>req, <Response>res);
        expect(mockViewUserByName).toBeCalledWith("Name");
      });

      it('sends data correctly', async () => {
        mockViewUserByName = jest.fn().mockResolvedValue([[]]);
        await userFriendshipController
        .deleteFriendship(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({message: 'User not found.'});
      });
  
      it('returns correctly', async () => {
        mockViewUserByName = jest.fn().mockResolvedValue([[]]);
        const actual = await userFriendshipController
        .deleteFriendship(<Request>req, <Response>res);
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

      it('uses viewUserByName correctly', async () => {
        mockViewUserByName = jest.fn().mockResolvedValue([
          [{user_id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController
        .deleteFriendship(<Request>req, <Response>res);
        expect(mockViewUserByName).toBeCalledWith("Name");
      });

      it('uses deleteFriendship correctly', async () => {
        mockViewUserByName = jest.fn().mockResolvedValue([
          [{user_id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController
        .deleteFriendship(<Request>req, <Response>res);
        expect(mockDeleteFriendship).toBeCalledWith(150, 42);
      });

      it('sends data correctly', async () => {
        mockViewUserByName = jest.fn().mockResolvedValue([
          [{user_id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController
        .deleteFriendship(<Request>req, <Response>res);
        expect(res.send)
        .toBeCalledWith({message: 'No longer friends. Maybe again later.'});
      });
  
      it('returns correctly', async () => {
        mockViewUserByName = jest.fn().mockResolvedValue([
          [{user_id: 42, avatar: "NameXYZ"}]
        ]);
        const actual = await userFriendshipController
        .deleteFriendship(<Request>req, <Response>res);
        expect(actual)
        .toEqual({message: 'No longer friends. Maybe again later.'});
      });
    });

  });

  describe('blockUser method', () => {

    describe('when desired friend does not exist', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'User not found.'})
      };

      it('uses viewUserByName correctly', async () => {
        mockViewUserByName = jest.fn().mockResolvedValue([[]]);
        await userFriendshipController
        .blockUser(<Request>req, <Response>res);
        expect(mockViewUserByName).toBeCalledWith("Name");
      });

      it('sends data correctly', async () => {
        mockViewUserByName = jest.fn().mockResolvedValue([[]]);
        await userFriendshipController
        .blockUser(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({message: 'User not found.'});
      });
  
      it('returns correctly', async () => {
        mockViewUserByName = jest.fn().mockResolvedValue([[]]);
        const actual = await userFriendshipController
        .blockUser(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'User not found.'});
      });
    });

    describe('when desired friend exists', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'User blocked.'})
      };

      it('uses viewUserByName correctly', async () => {
        mockViewUserByName = jest.fn().mockResolvedValue([
          [{user_id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController
        .blockUser(<Request>req, <Response>res);
        expect(mockViewUserByName).toBeCalledWith("Name");
      });

      it('uses blockUser correctly', async () => {
        mockViewUserByName = jest.fn().mockResolvedValue([
          [{user_id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController
        .blockUser(<Request>req, <Response>res);
        expect(mockBlockUser).toBeCalledWith(150, 42);
      });

      it('sends data correctly', async () => {
        mockViewUserByName = jest.fn().mockResolvedValue([
          [{user_id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController
        .blockUser(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({message: 'User blocked.'});
      });
  
      it('returns correctly', async () => {
        mockViewUserByName = jest.fn().mockResolvedValue([
          [{user_id: 42, avatar: "NameXYZ"}]
        ]);
        const actual = await userFriendshipController
        .blockUser(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'User blocked.'});
      });
    });

  });

  describe('unblockUser method', () => {

    describe('when desired friend does not exist', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'User not found.'})
      };

      it('uses viewUserByName correctly', async () => {
        mockViewUserByName = jest.fn().mockResolvedValue([[]]);
        await userFriendshipController
        .unblockUser(<Request>req, <Response>res);
        expect(mockViewUserByName).toBeCalledWith("Name");
      });

      it('sends data correctly', async () => {
        mockViewUserByName = jest.fn().mockResolvedValue([[]]);
        await userFriendshipController
        .unblockUser(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({message: 'User not found.'});
      });
  
      it('returns correctly', async () => {
        mockViewUserByName = jest.fn().mockResolvedValue([[]]);
        const actual = await userFriendshipController
        .unblockUser(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'User not found.'});
      });
    });

    describe('when desired friend exists', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'User unblocked.'})
      };

      it('uses viewUserByName correctly', async () => {
        mockViewUserByName = jest.fn().mockResolvedValue([
          [{user_id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController
        .unblockUser(<Request>req, <Response>res);
        expect(mockViewUserByName).toBeCalledWith("Name");
      });

      it('uses unblockUser correctly', async () => {
        mockViewUserByName = jest.fn().mockResolvedValue([
          [{user_id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController
        .unblockUser(<Request>req, <Response>res);
        expect(mockUnblockUser).toBeCalledWith(150, 42);
      });

      it('sends data correctly', async () => {
        mockViewUserByName = jest.fn().mockResolvedValue([
          [{user_id: 42, avatar: "NameXYZ"}]
        ]);
        await userFriendshipController
        .unblockUser(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({message: 'User unblocked.'});
      });
  
      it('returns correctly', async () => {
        mockViewUserByName = jest.fn().mockResolvedValue([
          [{user_id: 42, avatar: "NameXYZ"}]
        ]);
        const actual = await userFriendshipController
        .unblockUser(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'User unblocked.'});
      });
    });

  });
});