import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import { UserFriendshipController } from '../../../../src/controllers/user';
import {
  validFriendshipEntity
} from '../../../../src/lib/validations/friendship/entity';

const pool: Partial<Pool> = {};
const controller = new UserFriendshipController(<Pool>pool);

jest.mock('superstruct');

jest.mock('../../../../src/access/mysql', () => ({
  Friendship: jest.fn().mockImplementation(() => ({
    getByFriend:  mockGetByFriend,
    checkIfBlockedBy:  mockCheckIfBlockedBy,
    view: mockView,
    create: mockCreate,
    accept: mockAccept,
    reject: mockReject,
    delete: mockDelete,
    block: mockBlock,
    unblock: mockUnblock
  })),
  User: jest.fn().mockImplementation(() => ({viewByName: mockViewByName}))
}));
let mockGetByFriend = jest.fn();
let mockCheckIfBlockedBy = jest.fn();
let mockView = jest.fn();
let mockCreate = jest.fn();
let mockAccept = jest.fn();
let mockReject = jest.fn();
let mockDelete = jest.fn();
let mockBlock = jest.fn();
let mockUnblock = jest.fn();

let mockViewByName = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('user friendship controller', () => {
  const session = {...<Express.Session>{}, userInfo: {username: "Name"}};

  describe('view method', () => {
    const rows = [{name: "Name1"}];
    const req: Partial<Request> = {session};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue([rows])};

    beforeAll(() => {
      mockView = jest.fn().mockResolvedValue([rows]);
    });

    it('uses view correctly', async () => {
      await controller.view(<Request>req, <Response>res);
      expect(mockView).toHaveBeenCalledWith("Name");
    });

    it('sends data correctly', async () => {
      await controller.view(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith([rows]);
    });

    it('returns correctly', async () => {
      const actual = await controller.view(<Request>req, <Response>res);
      expect(actual).toEqual([rows]);
    });
  });

  describe('create method', () => {

    describe('when desired friend does not exist', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message: 'User not found.'})};
      
      beforeAll(() => {
        mockViewByName = jest.fn().mockResolvedValue([[]]);
      });

      it('uses viewByName correctly', async () => {
        await controller.create(<Request>req, <Response>res);
        expect(mockViewByName).toHaveBeenCalledWith("Name");
      });

      it('sends data correctly', async () => {
        await controller.create(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message: 'User not found.'});
      });
  
      it('returns correctly', async () => {
        const actual = await controller.create(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'User not found.'});
      });
    });

    describe('when blocked by desired friend', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name1"}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message: 'User not found.'})};

      beforeAll(() => {
        mockCheckIfBlockedBy =
        jest.fn().mockResolvedValue([[{user: "Name", friend: "Name1"}]]);
        mockViewByName =
          jest.fn().mockResolvedValue([[{username: "Name1", avatar: "Name1"}]]);
      });

      it('uses checkIfBlockedBy correctly', async () => {
        await controller.create(<Request>req, <Response>res);
        expect(mockCheckIfBlockedBy).toHaveBeenCalledWith("Name", "Name1");
      });

      it('sends data correctly', async () => {
        await controller.create(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message: 'User not found.'});
      });
  
      it('returns correctly', async () => {
        const actual = await controller.create(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'User not found.'});
      });
    });

    describe('when friendship does not already exist', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message: 'Friendship request sent.'})
      };

      beforeAll(() => {
        mockCheckIfBlockedBy = jest.fn().mockResolvedValue([[]]);
        mockGetByFriend = jest.fn().mockResolvedValue([[]]);
        mockViewByName =
          jest.fn().mockResolvedValue([[{username: "Name1", avatar: "Name1"}]]);
      });

      it ('uses getFriendshipByFriend correctly', async () => {
        await controller.create(<Request>req, <Response>res);
        expect(mockGetByFriend).toHaveBeenCalledWith("Name", "Name1");
      });

      it('uses assert correctly', async () => {
        await controller.create(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {
            user: "Name",
            friend: "Name1",
            status1: "pending-sent",
            status2: "pending-received"
          },
          validFriendshipEntity
        );
      });

      it('uses create correctly', async () => {
        await controller.create(<Request>req, <Response>res);
        expect(mockCreate).toHaveBeenCalledTimes(1);
      });

      it('sends data correctly', async () => {
        await controller.create(<Request>req, <Response>res);
        expect(res.send)
          .toHaveBeenCalledWith({message: 'Friendship request sent.'});
      });
  
      it('returns correctly', async () => {
        const actual = await controller.create(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Friendship request sent.'});
      });
    });

    describe('when status is pending-sent', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message: 'Already sent.'})};

      beforeAll(() => {
        mockCheckIfBlockedBy = jest.fn().mockResolvedValue([[]]);
        mockGetByFriend = jest.fn().mockResolvedValue([
          [{user: "Name", friend: "Name1", status: "pending-sent"}]
        ]);
        mockViewByName =
          jest.fn().mockResolvedValue([[{username: "Name1", avatar: "Name1"}]]);
      });

      it('sends data correctly', async () => {
        await controller.create(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message: 'Already sent.'});
      });
  
      it('returns correctly', async () => {
        const actual = await controller.create(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Already sent.'});
      });
    });

    describe('when status is pending-received', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message: 'Already received.'})};

      beforeAll(() => {
        mockCheckIfBlockedBy = jest.fn().mockResolvedValue([[]]);
        mockGetByFriend = jest.fn().mockResolvedValue([
          [{user: "Name", friend: "Name1", status: "pending-received"}]
        ]);
        mockViewByName =
          jest.fn().mockResolvedValue([[{username: "Name1", avatar: "Name1"}]]);
      });

      it('sends data correctly', async () => {
        await controller.create(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message: 'Already received.'});
      });
  
      it('returns correctly', async () => {
        const actual = await controller.create(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Already received.'});
      });
    });

    describe('when status is accepted', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message: 'Already friends.'})};

      beforeAll(() => {
        mockCheckIfBlockedBy = jest.fn().mockResolvedValue([[]]);
        mockGetByFriend =  jest.fn().mockResolvedValue([
          [{user: "Name", friend: "Name1", status: "accepted"}]
        ]);
        mockViewByName =
          jest.fn().mockResolvedValue([[{username: "Name1", avatar: "Name1"}]]);
      });

      it('sends data correctly', async () => {
        await controller.create(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message: 'Already friends.'});
      });
  
      it('returns correctly', async () => {
        const actual = await controller.create(<Request>req, <Response>res);
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

      beforeAll(() => {
        mockCheckIfBlockedBy = jest.fn().mockResolvedValue([[]]);
        mockGetByFriend =  jest.fn().mockResolvedValue([
          [{user: "Name", friend: "Name1", status: "blocked"}]
        ]);
        mockViewByName =
          jest.fn().mockResolvedValue([[{username: "Name1", avatar: "Name1"}]]);
      });

      it('sends data correctly', async () => {
        await controller.create(<Request>req, <Response>res);
        expect(res.send)
          .toHaveBeenCalledWith({message: 'User blocked. First unblock.'});
      });

      it('returns correctly', async () => {
        const actual = await controller.create(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'User blocked. First unblock.'});
      });
    });

  });

  describe('accept method', () => {

    describe('when desired friend does not exist', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message: 'User not found.'})};

      beforeAll(() => {
        mockViewByName = jest.fn().mockResolvedValue([[]]);
      });

      it('uses viewByName correctly', async () => {
        await controller.accept(<Request>req, <Response>res);
        expect(mockViewByName).toHaveBeenCalledWith("Name");
      });

      it('sends data correctly', async () => {
        await controller.accept(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message: 'User not found.'});
      });
      
      it('returns correctly', async () => {
        const actual = await controller.accept(<Request>req, <Response>res);
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

      beforeAll(() => {
        mockViewByName =
          jest.fn().mockResolvedValue([[{username: "Name1", avatar: "Name1"}]]);
      });

      it('uses viewByName correctly', async () => {
        await controller.accept(<Request>req, <Response>res);
        expect(mockViewByName).toHaveBeenCalledWith("Name");
      });

      it('uses accept correctly', async () => {
        await controller.accept(<Request>req, <Response>res);
        expect(mockAccept).toHaveBeenCalledWith("Name", "Name1");
      });

      it('sends data correctly', async () => {
        await controller.accept(<Request>req, <Response>res);
        expect(res.send)
          .toHaveBeenCalledWith({message: 'Friendship request accepted.'});
      });
  
      it('returns correctly', async () => {
        const actual = await controller.accept(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Friendship request accepted.'});
      });
    });

  });

  describe('reject method', () => {

    describe('when desired friend does not exist', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message: 'User not found.'})};
      
      beforeAll(() => {
        mockViewByName = jest.fn().mockResolvedValue([[]]);
      });

      it('uses viewByName correctly', async () => {
        await controller.reject(<Request>req, <Response>res);
        expect(mockViewByName).toHaveBeenCalledWith("Name");
      });

      it('sends data correctly', async () => {
        await controller.reject(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message: 'User not found.'});
      });
  
      it('returns correctly', async () => {
        const actual = await controller.reject(<Request>req, <Response>res);
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

      beforeAll(() => {
        mockViewByName =
          jest.fn().mockResolvedValue([[{username: "Name1", avatar: "Name1"}]]);
      });

      it('uses viewByName correctly', async () => {
        await controller.reject(<Request>req, <Response>res);
        expect(mockViewByName).toHaveBeenCalledWith("Name");
      });

      it('uses reject correctly', async () => {
        await controller.reject(<Request>req, <Response>res);
        expect(mockReject).toHaveBeenCalledWith("Name", "Name1");
      });

      it('sends data correctly', async () => {
        await controller.reject(<Request>req, <Response>res);
        expect(res.send)
          .toHaveBeenCalledWith({message: 'Friendship request rejected.'});
      });
  
      it('returns correctly', async () => {
        const actual = await controller.reject(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'Friendship request rejected.'});
      });
    });

  });

  describe('delete method', () => {

    describe('when desired friend does not exist', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message: 'User not found.'})};

      beforeAll(() => {
        mockViewByName = jest.fn().mockResolvedValue([[]]);
      });

      it('uses viewByName correctly', async () => {
        await controller.delete(<Request>req, <Response>res);
        expect(mockViewByName).toHaveBeenCalledWith("Name");
      });

      it('sends data correctly', async () => {
        await controller.delete(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message: 'User not found.'});
      });
  
      it('returns correctly', async () => {
        const actual = await controller.delete(<Request>req, <Response>res);
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

      beforeAll(() => {
        mockViewByName =
          jest.fn().mockResolvedValue([[{username: "Name1", avatar: "Name1"}]]);
      });

      it('uses viewByName correctly', async () => {
        await controller.delete(<Request>req, <Response>res);
        expect(mockViewByName).toHaveBeenCalledWith("Name");
      });

      it('uses delete correctly', async () => {
        await controller.delete(<Request>req, <Response>res);
        expect(mockDelete).toHaveBeenCalledWith("Name", "Name1");
      });

      it('sends data correctly', async () => {
        await controller.delete(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({
          message: 'No longer friends. Maybe again later.'
        });
      });

      it('returns correctly', async () => {
        const actual = await controller.delete(<Request>req, <Response>res);
        expect(actual)
          .toEqual({message: 'No longer friends. Maybe again later.'});
      });
    });

  });

  describe('block method', () => {

    describe('when desired friend does not exist', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message: 'User not found.'})};

      beforeAll(() => {
        mockViewByName = jest.fn().mockResolvedValue([[]]);
      });

      it('uses viewByName correctly', async () => {
        await controller.block(<Request>req, <Response>res);
        expect(mockViewByName).toHaveBeenCalledWith("Name");
      });

      it('sends data correctly', async () => {
        await controller.block(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message: 'User not found.'});
      });
  
      it('returns correctly', async () => {
        const actual = await controller.block(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'User not found.'});
      });
    });

    describe('when desired friend exists', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message: 'User blocked.'})};

      beforeAll(() => {
        mockViewByName =
          jest.fn().mockResolvedValue([[{username: "Name1", avatar: "Name1"}]]);
      });

      it('uses viewByName correctly', async () => {
        await controller.block(<Request>req, <Response>res);
        expect(mockViewByName).toHaveBeenCalledWith("Name");
      });

      it('uses block correctly', async () => {
        await controller.block(<Request>req, <Response>res);
        expect(mockBlock).toHaveBeenCalledWith("Name", "Name1");
      });

      it('sends data correctly', async () => {
        await controller.block(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message: 'User blocked.'});
      });
  
      it('returns correctly', async () => {
        const actual = await controller.block(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'User blocked.'});
      });
    });

  });

  describe('unblock method', () => {

    describe('when desired friend does not exist', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message: 'User not found.'})};

      beforeAll(() => {
        mockViewByName = jest.fn().mockResolvedValue([[]]);
      });

      it('uses viewByName correctly', async () => {
        await controller.unblock(<Request>req, <Response>res);
        expect(mockViewByName).toHaveBeenCalledWith("Name");
      });

      it('sends data correctly', async () => {
        await controller.unblock(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message: 'User not found.'});
      });
  
      it('returns correctly', async () => {
        const actual = await controller.unblock(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'User not found.'});
      });
    });

    describe('when desired friend exists', () => {
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message: 'User unblocked.'})};

      beforeAll(() => {
        mockViewByName =
          jest.fn().mockResolvedValue([[{username: "Name1", avatar: "Name1"}]]);
      });

      it('uses viewByName correctly', async () => {
        await controller.unblock(<Request>req, <Response>res);
        expect(mockViewByName).toHaveBeenCalledWith("Name");
      });

      it('uses unblock correctly', async () => {
        await controller.unblock(<Request>req, <Response>res);
        expect(mockUnblock).toHaveBeenCalledWith("Name", "Name1");
      });

      it('sends data correctly', async () => {
        await controller.unblock(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message: 'User unblocked.'});
      });
  
      it('returns correctly', async () => {
        const actual = await controller.unblock(<Request>req, <Response>res);
        expect(actual).toEqual({message: 'User unblocked.'});
      });
    });

  });
});