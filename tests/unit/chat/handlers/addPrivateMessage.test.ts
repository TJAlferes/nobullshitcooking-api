import { Socket } from 'socket.io';

import { pool } from '../../../../src/lib/connections/mysql';  // just mock like in others?
import { IFriendship, Friendship } from '../../../../src/access/mysql/Friendship';
import { IUser, User } from '../../../../src/access/mysql/User';
import { IMessengerUser } from '../../../../src/access/redis/MessengerUser';
import { PrivateMessage } from '../../../../src/chat/entities/PrivateMessage';
import { IAddPrivateMessage, addPrivateMessage } from '../../../../src/chat/handlers/addPrivateMessage';

let mockGetSocketId = jest.fn();
let mockMessengerUser: Partial<IMessengerUser>;

jest.mock('../../../../src/access/mysql/Friendship', () => ({
  Friendship: jest.fn().mockImplementation(() => ({
    viewBlocked: mockViewBlocked
  }))
}));
let mockViewBlocked = jest.fn();
let mockNobscFriendship: IFriendship;

jest.mock('../../../../src/access/mysql/User', () => ({
  User: jest.fn().mockImplementation(() => ({getByName: mockGetByName}))
}));
let mockGetByName = jest.fn();
let mockNobscUser: IUser;

jest.mock('../../../../src/chat/entities/PrivateMessage');
const mockPrivateMessage = PrivateMessage as jest.Mocked<typeof PrivateMessage>;

const rooms = new Set<string>();
rooms.add("room");
const mockBroadcast: any =
  {emit: jest.fn(), to: jest.fn((room: string) => mockBroadcast)};
const mockSocket: Partial<Socket> = {
  broadcast: <Socket>mockBroadcast,
  emit: jest.fn().mockReturnValue(true),
  join: jest.fn(),
  leave: jest.fn(),
  rooms
};
const params = {
  to: "other",
  from: "self",
  text: "hello",
  socket: <Socket>mockSocket
};

let currParams: IAddPrivateMessage;

afterEach(() => {
  jest.clearAllMocks();
});

describe('addPrivateMessage handler', () => {

  describe('when user being messaged does not exist', () => {
    beforeAll(() => {
      mockMessengerUser = {getSocketId: mockGetSocketId};

      mockNobscFriendship = new Friendship(pool);

      mockGetByName = jest.fn().mockResolvedValue([[]]);
      mockNobscUser = new User(pool);

      currParams = {
        ...params,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship,
        nobscUser: <IUser>mockNobscUser
      };
    });

    it('uses getUserByName correctly', async () => {
      await addPrivateMessage(currParams);
      expect(mockGetByName).toHaveBeenCalledWith("other");
    });

    it('uses socket.emit', async () => {
      await addPrivateMessage(currParams);
      expect(params.socket.emit)
        .toHaveBeenCalledWith('FailedPrivateMessage', 'User not found.');
    });

    // these may be wrong...
    it('returns correctly', async () => {
      const actual = await addPrivateMessage(currParams);
      expect(actual).toEqual(true);
    });
  });

  describe('when user being messaged blocked you', () => {
    beforeAll(() => {
      mockMessengerUser = {getSocketId: mockGetSocketId};

      mockViewBlocked = jest.fn().mockResolvedValue([[{username: "other"}]]);
      mockNobscFriendship = new Friendship(pool);

      mockGetByName = jest.fn().mockResolvedValue([[{username: "other"}]]);
      mockNobscUser = new User(pool);

      currParams = {
        ...params,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship,
        nobscUser: <IUser>mockNobscUser
      };
    });

    it('uses viewMyBlockedUsers correctly', async () => {
      await addPrivateMessage(currParams);
      expect(mockViewBlocked).toHaveBeenCalledWith("other");
    });

    it('uses socket.emit', async () => {
      await addPrivateMessage(currParams);
      expect(params.socket.emit)
        .toHaveBeenCalledWith('FailedPrivateMessage', 'User not found.');
    });

    it('returns correctly', async () => {
      const actual = await addPrivateMessage(currParams);
      expect(actual).toEqual(true);
    });
  });

  describe('when user being messaged is offline', () => {
    beforeAll(() => {
      mockGetSocketId = jest.fn().mockResolvedValue(undefined);
      mockMessengerUser = {getSocketId: mockGetSocketId};

      mockViewBlocked = jest.fn().mockResolvedValue([[]]);
      mockNobscFriendship = new Friendship(pool);

      mockGetByName = jest.fn().mockResolvedValue([[{username: "other"}]]);
      mockNobscUser = new User(pool);

      currParams = {
        ...params,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship,
        nobscUser: <IUser>mockNobscUser
      };
    });

    it('uses getSocketId correctly', async () => {
      await addPrivateMessage(currParams);
      expect(mockGetSocketId).toHaveBeenCalledWith("other");
    });

    it('uses socket.emit', async () => {
      await addPrivateMessage(currParams);
      expect(params.socket.emit)
        .toHaveBeenCalledWith('FailedPrivateMessage', 'User not found.');
    });

    it('returns correctly', async () => {
      const actual = await addPrivateMessage(currParams);
      expect(actual).toEqual(true);
    });
  });

  describe('when okay', () => {
    beforeAll(() => {
      mockGetSocketId = jest.fn().mockResolvedValue("123456789");
      mockMessengerUser = {getSocketId: mockGetSocketId};

      mockViewBlocked = jest.fn().mockResolvedValue([[]]);
      mockNobscFriendship = new Friendship(pool);

      mockGetByName = jest.fn().mockResolvedValue([[{username: "other"}]]);
      mockNobscUser = new User(pool);

      currParams = {
        ...params,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship,
        nobscUser: <IUser>mockNobscUser
      };
    });
  
    it('uses PrivateMessage correctly', async () => {
      await addPrivateMessage(currParams);
      expect(mockPrivateMessage).toHaveBeenCalledWith("other", "self", "hello");
    });

    it ('uses socket.broadcast.to correctly', async () => {
      await addPrivateMessage(currParams);
      expect(params.socket.broadcast.to).toHaveBeenCalledWith("123456789");
    });

    it ('uses socket.broadcast.to.emit correctly', async () => {
      await addPrivateMessage(currParams);
      expect(params.socket.broadcast.emit).toHaveBeenCalledWith(
        'AddPrivateMessage', PrivateMessage("other", "self", "hello")
      );
    });

    it ('uses socket.emit with AddPrivateMessage event correctly', async () => {
      await addPrivateMessage(currParams);
      expect(params.socket.emit).toHaveBeenCalledWith(
        'AddPrivateMessage', PrivateMessage("other", "self", "hello")
      );
    });
  });

});