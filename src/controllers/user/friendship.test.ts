import { Express, Request, Response } from 'express';
import { assert } from 'superstruct';
import { mocked } from 'ts-jest/utils';

import { Friendship } from '../../mysql-access/Friendship';
import { User } from '../../mysql-access/User';
import { userFriendshipController } from './friendship';

const rows: any = [{id: 1, name: "Name"}];

jest.mock('superstruct');

jest.mock('../../mysql-access/Friendship', () => ({
  Friendship: jest.fn().mockImplementation(() => {
    const rows: any = [{id: 1, name: "Name"}];
    return {
      getFriendshipByFriendId:  jest.fn().mockResolvedValue([rows]),
      checkIfBlockedBy:  jest.fn().mockResolvedValue([rows]),
      viewMyFriendships: jest.fn().mockResolvedValue([rows]),
      viewMyAcceptedFriendships: jest.fn().mockResolvedValue([rows]),
      viewMyPendingFriendships: jest.fn().mockResolvedValue([rows]),
      viewMyBlockedUsers: jest.fn().mockResolvedValue([rows]),
      createFriendship: jest.fn().mockResolvedValue([rows]),
      acceptFriendship: jest.fn().mockResolvedValue([rows]),
      rejectFriendship: jest.fn().mockResolvedValue([rows]),
      deleteFriendship: jest.fn().mockResolvedValue([rows]),
      blockUser: jest.fn().mockResolvedValue([rows]),
      unblockUser: jest.fn().mockResolvedValue([rows])
    };
  })
}));

jest.mock('../../mysql-access/User', () => ({
  User: jest.fn().mockImplementation(() => {
    const rows: any = [{id: 1, name: "Name"}];
    return {
      getUserByEmail: jest.fn().mockResolvedValue([rows]),
      getUserByName: jest.fn().mockResolvedValue([rows]),
      viewUserById: jest.fn().mockResolvedValue([rows]),
      viewUserByName: jest.fn().mockResolvedValue([rows]),
      createUser: jest.fn().mockResolvedValue([rows]),
      updateUser: jest.fn().mockResolvedValue([rows]),
      deleteUser: jest.fn().mockResolvedValue([rows])
    };
  })
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('user friendship controller', () => {
  describe('viewMyFriendships method', () => {
    const session = {...<Express.Session>{}, userInfo: {userId: 1}};
    const req: Partial<Request> = {session};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    it('uses Friendship mysql access', async () => {
      await userFriendshipController
      .viewMyFriendships(<Request>req, <Response>res);
      const MockedFriendship = mocked(Friendship, true);
      expect(MockedFriendship).toHaveBeenCalledTimes(1);
    });

    it('sends data', async () => {
      await userFriendshipController
      .viewMyFriendships(<Request>req, <Response>res);
      expect(res.send).toBeCalledWith([rows]);
    });

    it('returns correctly', async () => {
      const actual = await userFriendshipController
      .viewMyFriendships(<Request>req, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });

  describe('createFriendship method', () => {});

  describe('acceptFriendship method', () => {});

  describe('rejectFriendship method', () => {});

  describe('deleteFriendship method', () => {});

  describe('blockUser method', () => {});

  describe('unblockUser method', () => {});
});