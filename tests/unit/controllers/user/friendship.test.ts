import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { assert } from 'superstruct';

import { UserFriendshipController } from '../../../../src/controllers/user';
import { validFriendship } from '../../../../src/lib/validations/entities';

const pool: Partial<Pool> = {};
const controller = new UserFriendshipController(<Pool>pool);

jest.mock('superstruct');

const row = {id: 1, name: "Name"};
const rows = [{id: 1, name: "Name"}, {id: 2, name: "Name"}];
jest.mock('../../../../src/access/mysql', () => ({
  Friendship: jest.fn().mockImplementation(() => ({
    getByFriendId:  mockgetByFriendId,
    checkIfBlockedBy:  mockcheckIfBlockedBy,
    view: mockview,
    create: mockcreate,
    accept: mockaccept,
    reject: mockreject,
    delete: mockdelete,
    block: mockblock,
    unblock: mockunblock
  })),
  User: jest.fn().mockImplementation(() => ({viewByName: mockviewByName}))
}));
let mockgetByFriendId = jest.fn();
let mockcheckIfBlockedBy = jest.fn();
let mockview = jest.fn();
let mockcreate = jest.fn();
let mockaccept = jest.fn();
let mockreject = jest.fn();
let mockdelete = jest.fn();
let mockblock = jest.fn();
let mockunblock = jest.fn();
let mockviewByName = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('user friendship controller', () => {
  const session = {...<Express.Session>{}, userInfo: {id: 88}};

  describe('view method', () => {
    const rows = [{name: "Name1"}];
    const req: Partial<Request> = {session};
    const res: Partial<Response> = {send: jest.fn().mockResolvedValue(rows)};

    beforeAll(() => {
      mockview = jest.fn().mockResolvedValue(rows);
    });

    it('uses view', async () => {
      await controller.view(<Request>req, <Response>res);
      expect(mockview).toHaveBeenCalledWith(1);
    });

    it('returns sent data', async () => {
      const actual = await controller.view(<Request>req, <Response>res);
      expect(res.send).toHaveBeenCalledWith(rows);
      expect(actual).toEqual(rows);
    });
  });

  describe('create method', () => {
    describe('when desired friend does not exist', () => {
      const message = 'User not found.';
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};
      
      beforeAll(() => {
        mockviewByName = jest.fn().mockResolvedValue([]);
      });

      it('uses viewByName', async () => {
        await controller.create(<Request>req, <Response>res);
        expect(mockviewByName).toHaveBeenCalledWith("Name");
      });
  
      it('returns sent data', async () => {
        const actual = await controller.create(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    describe('when blocked by desired friend', () => {
      const message = 'User not found.';
      const req: Partial<Request> = {session, body: {friendName: "Name1"}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};

      beforeAll(() => {
        mockcheckIfBlockedBy =
        jest.fn().mockResolvedValue([[{user: "Name", friend: "Name1"}]]);
        mockviewByName =
          jest.fn().mockResolvedValue([[{username: "Name1", avatar: "Name1"}]]);
      });

      it('uses checkIfBlockedBy', async () => {
        await controller.create(<Request>req, <Response>res);
        expect(mockcheckIfBlockedBy).toHaveBeenCalledWith("Name", "Name1");
      });
  
      it('returns sent data', async () => {
        const actual = await controller.create(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    describe('when friendship does not already exist', () => {
      const message = 'Friendship request sent.';
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> = {
        send: jest.fn().mockResolvedValue({message})
      };

      beforeAll(() => {
        mockcheckIfBlockedBy = jest.fn().mockResolvedValue([[]]);
        mockgetByFriendId = jest.fn().mockResolvedValue([[]]);
        mockviewByName =
          jest.fn().mockResolvedValue([[{username: "Name1", avatar: "Name1"}]]);
      });

      it ('uses getFriendshipByFriendId', async () => {
        await controller.create(<Request>req, <Response>res);
        expect(mockgetByFriendId).toHaveBeenCalledWith("Name", "Name1");
      });

      it('uses assert', async () => {
        await controller.create(<Request>req, <Response>res);
        expect(assert).toHaveBeenCalledWith(
          {
            user: "Name",
            friend: "Name1",
            status1: "pending-sent",
            status2: "pending-received"
          },
          validFriendship
        );
      });

      it('uses create', async () => {
        await controller.create(<Request>req, <Response>res);
        expect(mockcreate).toHaveBeenCalledTimes(1);  // TO DO: CalledWith
      });
  
      it('returns sent data', async () => {
        const actual = await controller.create(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    describe('when status is pending-sent', () => {
      const message = 'Already sent.';
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};

      beforeAll(() => {
        mockcheckIfBlockedBy = jest.fn().mockResolvedValue([[]]);
        mockgetByFriendId = jest.fn().mockResolvedValue([
          [{user: "Name", friend: "Name1", status: "pending-sent"}]
        ]);
        mockviewByName =
          jest.fn().mockResolvedValue([[{username: "Name1", avatar: "Name1"}]]);
      });
  
      it('returns sent data', async () => {
        const actual = await controller.create(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    describe('when status is pending-received', () => {
      const message = 'Already received.';
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};

      beforeAll(() => {
        mockcheckIfBlockedBy = jest.fn().mockResolvedValue([[]]);
        mockgetByFriendId = jest.fn().mockResolvedValue([
          [{user: "Name", friend: "Name1", status: "pending-received"}]
        ]);
        mockviewByName =
          jest.fn().mockResolvedValue([[{username: "Name1", avatar: "Name1"}]]);
      });
  
      it('returns sent data', async () => {
        const actual = await controller.create(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    describe('when status is accepted', () => {
      const message = 'Already friends.';
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};

      beforeAll(() => {
        mockcheckIfBlockedBy = jest.fn().mockResolvedValue([[]]);
        mockgetByFriendId =  jest.fn().mockResolvedValue([
          [{user: "Name", friend: "Name1", status: "accepted"}]
        ]);
        mockviewByName =
          jest.fn().mockResolvedValue([[{username: "Name1", avatar: "Name1"}]]);
      });
  
      it('returns sent data', async () => {
        const actual = await controller.create(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    describe('when status is blocked', () => {
      const message = 'User blocked. First unblock.';
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};

      beforeAll(() => {
        mockcheckIfBlockedBy = jest.fn().mockResolvedValue([[]]);
        mockgetByFriendId =  jest.fn().mockResolvedValue([
          [{user: "Name", friend: "Name1", status: "blocked"}]
        ]);
        mockviewByName =
          jest.fn().mockResolvedValue([[{username: "Name1", avatar: "Name1"}]]);
      });

      it('returns sent data', async () => {
        const actual = await controller.create(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });
  });

  describe('accept method', () => {
    describe('when desired friend does not exist', () => {
      const message = 'User not found.';
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};

      beforeAll(() => {
        mockviewByName = jest.fn().mockResolvedValue([[]]);
      });

      it('uses viewByName', async () => {
        await controller.accept(<Request>req, <Response>res);
        expect(mockviewByName).toHaveBeenCalledWith("Name");
      });
      
      it('returns sent data', async () => {
        const actual = await controller.accept(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    describe('when desired friend exists', () => {
      const message = 'Friendship request accepted.';
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};

      beforeAll(() => {
        mockviewByName =
          jest.fn().mockResolvedValue([[{username: "Name1", avatar: "Name1"}]]);
      });

      it('uses viewByName', async () => {
        await controller.accept(<Request>req, <Response>res);
        expect(mockviewByName).toHaveBeenCalledWith("Name");
      });

      it('uses accept', async () => {
        await controller.accept(<Request>req, <Response>res);
        expect(mockaccept).toHaveBeenCalledWith("Name", "Name1");
      });
  
      it('returns sent data', async () => {
        const actual = await controller.accept(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });
  });

  describe('reject method', () => {
    describe('when desired friend does not exist', () => {
      const message = 'User not found.';
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};
      
      beforeAll(() => {
        mockviewByName = jest.fn().mockResolvedValue([[]]);
      });

      it('uses viewByName', async () => {
        await controller.reject(<Request>req, <Response>res);
        expect(mockviewByName).toHaveBeenCalledWith("Name");
      });
  
      it('returns sent data', async () => {
        const actual = await controller.reject(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    describe('when desired friend exists', () => {
      const message = 'Friendship request rejected.';
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};

      beforeAll(() => {
        mockviewByName =
          jest.fn().mockResolvedValue([[{username: "Name1", avatar: "Name1"}]]);
      });

      it('uses viewByName', async () => {
        await controller.reject(<Request>req, <Response>res);
        expect(mockviewByName).toHaveBeenCalledWith("Name");
      });

      it('uses reject', async () => {
        await controller.reject(<Request>req, <Response>res);
        expect(mockreject).toHaveBeenCalledWith("Name", "Name1");
      });
  
      it('returns sent data', async () => {
        const actual = await controller.reject(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });
  });

  describe('delete method', () => {
    describe('when desired friend does not exist', () => {
      const message = 'User not found.';
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};

      beforeAll(() => {
        mockviewByName = jest.fn().mockResolvedValue([[]]);
      });

      it('uses viewByName', async () => {
        await controller.delete(<Request>req, <Response>res);
        expect(mockviewByName).toHaveBeenCalledWith("Name");
      });
  
      it('returns sent data', async () => {
        const actual = await controller.delete(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    describe('when desired friend exists', () => {
      const message = 'No longer friends. Maybe again later.';
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};

      beforeAll(() => {
        mockviewByName =
          jest.fn().mockResolvedValue([[{username: "Name1", avatar: "Name1"}]]);
      });

      it('uses viewByName', async () => {
        await controller.delete(<Request>req, <Response>res);
        expect(mockviewByName).toHaveBeenCalledWith("Name");
      });

      it('uses delete', async () => {
        await controller.delete(<Request>req, <Response>res);
        expect(mockdelete).toHaveBeenCalledWith("Name", "Name1");
      });

      it('returns sent data', async () => {
        const actual = await controller.delete(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });
  });

  describe('block method', () => {
    describe('when desired friend does not exist', () => {
      const message = 'User not found.';
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};

      beforeAll(() => {
        mockviewByName = jest.fn().mockResolvedValue([[]]);
      });

      it('uses viewByName', async () => {
        await controller.block(<Request>req, <Response>res);
        expect(mockviewByName).toHaveBeenCalledWith("Name");
      });
  
      it('returns sent data', async () => {
        const actual = await controller.block(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    describe('when desired friend exists', () => {
      const message = 'User blocked.';
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};

      beforeAll(() => {
        mockviewByName =
          jest.fn().mockResolvedValue([[{username: "Name1", avatar: "Name1"}]]);
      });

      it('uses viewByName', async () => {
        await controller.block(<Request>req, <Response>res);
        expect(mockviewByName).toHaveBeenCalledWith("Name");
      });

      it('uses block', async () => {
        await controller.block(<Request>req, <Response>res);
        expect(mockblock).toHaveBeenCalledWith("Name", "Name1");
      });

      it('returns sent data', async () => {
        const actual = await controller.block(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

  });

  describe('unblock method', () => {
    describe('when desired friend does not exist', () => {
      const message = 'User not found.';
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};

      beforeAll(() => {
        mockviewByName = jest.fn().mockResolvedValue([[]]);
      });

      it('uses viewByName', async () => {
        await controller.unblock(<Request>req, <Response>res);
        expect(mockviewByName).toHaveBeenCalledWith("Name");
      });
  
      it('returns sent data', async () => {
        const actual = await controller.unblock(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    describe('when desired friend exists', () => {
      const message = 'User unblocked.';
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};

      beforeAll(() => {
        mockviewByName =
          jest.fn().mockResolvedValue([[{username: "Name1", avatar: "Name1"}]]);
      });

      it('uses viewByName', async () => {
        await controller.unblock(<Request>req, <Response>res);
        expect(mockviewByName).toHaveBeenCalledWith("Name");
      });

      it('uses unblock', async () => {
        await controller.unblock(<Request>req, <Response>res);
        expect(mockunblock).toHaveBeenCalledWith("Name", "Name1");
      });
  
      it('returns sent data', async () => {
        const actual = await controller.unblock(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });
  });
});