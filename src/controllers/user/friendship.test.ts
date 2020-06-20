import { Request, Response } from 'express';
import { assert } from 'superstruct';
import { mocked } from 'ts-jest/utils';

import { Friendship } from '../../mysql-access/Friendship';
import { User } from '../../mysql-access/User';
import { userFriendshipController } from './friendship';

const rows: any = [{id: 1, name: "Name"}];  // del?

jest.mock('superstruct');

jest.mock('../../mysql-access/Friendship', () => {
  const originalModule = jest.requireActual('../../mysql-access/Friendship');
  return {
    ...originalModule,
    Friendship: jest.fn().mockImplementation(() => ({
      getFriendshipByFriendId:  jest.fn(),
      checkIfBlockedBy:  jest.fn(),
      viewMyFriendships: mockViewMyFriendships,
      createFriendship: jest.fn(),
      acceptFriendship: jest.fn(),
      rejectFriendship: jest.fn(),
      deleteFriendship: jest.fn(),
      blockUser: jest.fn(),
      unblockUser: jest.fn()
    }))
  };
});
let mockViewMyFriendships = jest.fn();

jest.mock('../../mysql-access/User', () => ({
  User: jest.fn().mockImplementation(() => {
    //const rows: any = [{user_id: 42, avatar: "NameXYZ"}];
    const rows: any = [];
    return {viewUserByName: jest.fn().mockResolvedValue([rows])};
  })
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('user friendship controller', () => {
  const session = {...<Express.Session>{}, userInfo: {userId: 1}};

  describe('viewMyFriendships method', () => {
    const req: Partial<Request> = {session};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses Friendship mysql access', async () => {
      const rows: any = [{id: 1, name: "Name"}];
      mockViewMyFriendships = jest.fn().mockResolvedValue([rows]);
      jest.doMock('../../mysql-access/Friendship', () => {
        const originalModule = jest.requireActual('../../mysql-access/Friendship');
        return {
          ...originalModule,
          Friendship: jest.fn().mockImplementation(() => ({
            viewMyFriendships: mockViewMyFriendships
          }))
        };
      });
      mockViewMyFriendships = jest.fn().mockResolvedValue([rows]);
      await userFriendshipController
      .viewMyFriendships(<Request>req, <Response>res);
      const MockedFriendship = mocked(Friendship, true);
      expect(MockedFriendship).toHaveBeenCalledTimes(1);
    });

    /*it('sends data', async () => {
      jest.doMock('../../mysql-access/Friendship', () => ({
        Friendship: jest.fn().mockImplementation(() => {
          const rows: any = [{id: 1, name: "Name"}];
          return {viewMyFriendships: jest.fn().mockResolvedValue([rows])};
        })
      }));
      await userFriendshipController
      .viewMyFriendships(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith([rows]);
    });

    it('returns correctly', async () => {
      jest.doMock('../../mysql-access/Friendship', () => ({
        Friendship: jest.fn().mockImplementation(() => {
          const rows: any = [{id: 1, name: "Name"}];
          return {viewMyFriendships: jest.fn().mockResolvedValue([rows])};
        })
      }));
      const actual = await userFriendshipController
      .viewMyFriendships(<Request>req, <Response>res);
      expect(actual).toEqual([rows]);
    });*/
  });

  describe('createFriendship method', () => {

    /*describe('when desired friend does not exist', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'User not found.'})
      };

      it('sends data', async () => {
        await userFriendshipController
        .createFriendship(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({message: 'User not found.'});
      });
  
      it('returns correctly', async () => {
        const actual = await userFriendshipController
        .createFriendship(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'User not found.'});
      });
    });*/

    /*describe('when blocked by desired friend', () => {
      jest.mock('../../mysql-access/Friendship', () => ({
        Friendship: jest.fn().mockImplementation(() => {
          const rows: any = [{user_id: 1, friend_id: 42}];
          return {checkIfBlockedBy:  jest.fn().mockResolvedValue([rows])};
        })
      }));

      jest.mock('../../mysql-access/User', () => ({
        User: jest.fn().mockImplementation(() => {
          const rows: any = [{user_id: 42, avatar: "NameXYZ"}];
          return {viewUserByName: jest.fn().mockResolvedValue([rows])};
        })
      }));

      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'User not found.'})
      };

      it('sends data', async () => {
        await userFriendshipController
        .createFriendship(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({message: 'User not found.'});
      });
  
      it('returns correctly', async () => {
        const actual = await userFriendshipController
        .createFriendship(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'User not found.'});
      });
    });*/

    /*describe('when friendship does not already exist', () => {
      jest.mock('../../mysql-access/Friendship', () => ({
        Friendship: jest.fn().mockImplementation(() => ({
          checkIfBlockedBy:  jest.fn().mockResolvedValue([[]]),
          getFriendshipByFriendId: jest.fn().mockResolvedValue([[]]),
          createFriendship: jest.fn().mockResolvedValue([
            [{user_id: 1, friendId: 42, status: "pending-sent"}]
          ])
        }))
      }));
      jest.mock('../../mysql-access/User', () => ({
        User: jest.fn().mockImplementation(() => {
          const rows: any = [{user_id: 42, avatar: "NameXYZ"}];
          return {viewUserByName: jest.fn().mockResolvedValue([rows])};
        })
      }));

      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({
          message: 'Friendship request sent.'
        })
      };

      it('sends data', async () => {
        await userFriendshipController
        .createFriendship(<Request>req, <Response>res);
        expect(res.send)
        .toBeCalledWith({message: 'Friendship request sent.'});
      });
  
      it('returns correctly', async () => {
        const actual = await userFriendshipController
        .createFriendship(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Friendship request sent.'});
      });
    });*/

    /*describe('when status is pending-sent', () => {
      jest.mock('../../mysql-access/Friendship', () => ({
        Friendship: jest.fn().mockImplementation(() => ({
          checkIfBlockedBy:  jest.fn().mockResolvedValue([[]]),
          getFriendshipByFriendId: jest.fn().mockResolvedValue([
            [{user_id: 1, friend_id: 42, status: "pending-sent"}]
          ])
        }))
      }));

      jest.mock('../../mysql-access/User', () => ({
        User: jest.fn().mockImplementation(() => {
          const rows: any = [{user_id: 42, avatar: "NameXYZ"}];
          return {viewUserByName: jest.fn().mockResolvedValue([rows])};
        })
      }));

      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({
          message: 'Already sent.'
        })
      };

      it('sends data', async () => {
        await userFriendshipController
        .createFriendship(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({
          message: 'Already sent.'
        });
      });
  
      it('returns correctly', async () => {
        const actual = await userFriendshipController
        .createFriendship(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Already sent.'});
      });
    });

    describe('when status is pending-received', () => {
      jest.mock('../../mysql-access/Friendship', () => ({
        Friendship: jest.fn().mockImplementation(() => ({
          checkIfBlockedBy:  jest.fn().mockResolvedValue([[]]),
          getFriendshipByFriendId: jest.fn().mockResolvedValue([
            [{user_id: 1, friend_id: 42, status: "accepted"}]
          ])
        }))
      }));

      jest.mock('../../mysql-access/User', () => ({
        User: jest.fn().mockImplementation(() => {
          const rows: any = [{user_id: 42, avatar: "NameXYZ"}];
          return {viewUserByName: jest.fn().mockResolvedValue([rows])};
        })
      }));

      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({
          message: 'Already received.'
        })
      };

      it('sends data', async () => {
        await userFriendshipController
        .createFriendship(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({
          message: 'Already received.'
        });
      });
  
      it('returns correctly', async () => {
        const actual = await userFriendshipController
        .createFriendship(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Already received.'});
      });
    });

    describe('when status is accepted', () => {
      jest.mock('../../mysql-access/Friendship', () => ({
        Friendship: jest.fn().mockImplementation(() => ({
          checkIfBlockedBy:  jest.fn().mockResolvedValue([[]]),
          getFriendshipByFriendId: jest.fn().mockResolvedValue([
            [{user_id: 1, friend_id: 42, status: "accepted"}]
          ])
        }))
      }));

      jest.mock('../../mysql-access/User', () => ({
        User: jest.fn().mockImplementation(() => {
          const rows: any = [{user_id: 42, avatar: "NameXYZ"}];
          return {viewUserByName: jest.fn().mockResolvedValue([rows])};
        })
      }));

      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({
          message: 'Already friends.'
        })
      };

      it('sends data', async () => {
        await userFriendshipController
        .createFriendship(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({
          message: 'Already friends.'
        });
      });
  
      it('returns correctly', async () => {
        const actual = await userFriendshipController
        .createFriendship(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Already friends.'});
      });
    });

    describe('when status is blocked', () => {
      jest.mock('../../mysql-access/Friendship', () => ({
        Friendship: jest.fn().mockImplementation(() => ({
          checkIfBlockedBy:  jest.fn().mockResolvedValue([[]]),
          getFriendshipByFriendId: jest.fn().mockResolvedValue([
            [{user_id: 1, friend_id: 42, status: "accepted"}]
          ])
        }))
      }));

      jest.mock('../../mysql-access/User', () => ({
        User: jest.fn().mockImplementation(() => {
          const rows: any = [{user_id: 42, avatar: "NameXYZ"}];
          return {viewUserByName: jest.fn().mockResolvedValue([rows])};
        })
      }));

      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({
          message: 'User blocked. First unblock.'
        })
      };

      it('sends data', async () => {
        await userFriendshipController
        .createFriendship(<Request>req, <Response>res);
        expect(res.send).toBeCalledWith({
          message: 'User blocked. First unblock.'
        });
      });

      it('returns correctly', async () => {
        const actual = await userFriendshipController
        .createFriendship(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'User blocked. First unblock.'});
      });
    });*/

  });

  describe('acceptFriendship method', () => {});

  describe('rejectFriendship method', () => {});

  describe('deleteFriendship method', () => {});

  describe('blockUser method', () => {});

  describe('unblockUser method', () => {});
});



/*
it('uses validation', async () => {
  await userFriendshipController
  .createFriendship(<Request>req, <Response>res);
  const MockedAssert = mocked(assert, true);
  expect(MockedAssert).toHaveBeenCalledTimes(1);
});

it('uses Friendship mysql access', async () => {
  await userFriendshipController
  .createFriendship(<Request>req, <Response>res);
  const MockedFriendship = mocked(Friendship, true);
  expect(MockedFriendship).toHaveBeenCalledTimes(1);
});

it('uses User mysql access', async () => {
  await userFriendshipController
  .createFriendship(<Request>req, <Response>res);
  const MockedUser = mocked(User, true);
  expect(MockedUser).toHaveBeenCalledTimes(1);
});
*/