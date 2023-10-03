import type { Request, Response } from 'express';
import type { ModifiedSession } from '../../../../src/app';

import { friendshipController } from '../../../../src/modules/user/friendship/controller';
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
        friendname: 'friendusername', // Modify as needed for each test case
      },
      session: {
        user_id: '123', // Modify as needed for each test case
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
    describe('when desired friend does not exist', () => {
      const message = 'User not found.';
      const req: Partial<Request> = {session, body: {friendName: "Name"}};
      const res: Partial<Response> =
        {send: jest.fn().mockResolvedValue({message})};
      
      beforeAll(() => {
        mockviewByName = jest.fn().mockResolvedValue([]);
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
  
      it('returns sent data', async () => {
        const actual = await controller.create(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });

    it('should handle successful friendship creation', async () => {
      // Mock UserRepo behavior (e.g., getByUsername should return a user)
      (UserRepo as jest.Mocked<typeof UserRepo>).getByUsername.mockResolvedValue({
        user_id: '456',
        // Add other user properties as needed
      });
  
      // Mock FriendshipRepo behavior (e.g., getOne should return null)
      mockedFriendshipRepo.getOne.mockResolvedValue(null);
  
      // Call the create method
      await friendshipController.create(req as Request, res as Response);
  
      expect(res.send).toHaveBeenCalledWith({message: 'Friendship request sent.'});
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
  
      it('returns sent data', async () => {
        const actual = await controller.unblock(<Request>req, <Response>res);
        expect(res.send).toHaveBeenCalledWith({message});
        expect(actual).toEqual({message});
      });
    });
  });
});