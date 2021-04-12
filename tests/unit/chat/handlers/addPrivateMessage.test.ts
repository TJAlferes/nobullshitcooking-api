import { Socket } from 'socket.io';

import { pool } from '../../../../src/lib/connections/mysql';  // just mock like in others?
import {
  Friendship,
  User,
  IFriendship,
  IUser
} from '../../../../src/access/mysql';
import { IChatUser } from '../../../../src/access/redis/ChatUser';
import { PrivateMessage } from '../../../../src/chat/entities/PrivateMessage';
import {
  addPrivateMessage,
  IAddPrivateMessage
} from '../../../../src/chat/handlers/addPrivateMessage';

let mockGetSocketId = jest.fn();
let mockChatUser: Partial<IChatUser>;

jest.mock('../../../../src/access/mysql', () => ({
  Friendship: jest.fn().mockImplementation(() => ({
    viewBlocked: mockViewBlocked
  })),
  User: jest.fn().mockImplementation(() => ({getByName: mockGetByName}))
}));
let mockFriendship: IFriendship;
let mockViewBlocked = jest.fn();
let mockUser: IUser;
let mockGetByName = jest.fn();

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
      mockChatUser = {getSocketId: mockGetSocketId};

      mockFriendship = new Friendship(pool);

      mockGetByName = jest.fn().mockResolvedValue([[]]);
      mockUser = new User(pool);

      currParams = {
        ...params,
        chatUser: <IChatUser>mockChatUser,
        friendship: <IFriendship>mockFriendship,
        user: <IUser>mockUser
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
      mockChatUser = {getSocketId: mockGetSocketId};

      mockViewBlocked = jest.fn().mockResolvedValue([[{username: "other"}]]);
      mockFriendship = new Friendship(pool);

      mockGetByName = jest.fn().mockResolvedValue([[{username: "other"}]]);
      mockUser = new User(pool);

      currParams = {
        ...params,
        chatUser: <IChatUser>mockChatUser,
        friendship: <IFriendship>mockFriendship,
        user: <IUser>mockUser
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
      mockChatUser = {getSocketId: mockGetSocketId};

      mockViewBlocked = jest.fn().mockResolvedValue([[]]);
      mockFriendship = new Friendship(pool);

      mockGetByName = jest.fn().mockResolvedValue([[{username: "other"}]]);
      mockUser = new User(pool);

      currParams = {
        ...params,
        chatUser: <IChatUser>mockChatUser,
        friendship: <IFriendship>mockFriendship,
        user: <IUser>mockUser
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
      mockChatUser = {getSocketId: mockGetSocketId};

      mockViewBlocked = jest.fn().mockResolvedValue([[]]);
      mockFriendship = new Friendship(pool);

      mockGetByName = jest.fn().mockResolvedValue([[{username: "other"}]]);
      mockUser = new User(pool);

      currParams = {
        ...params,
        chatUser: <IChatUser>mockChatUser,
        friendship: <IFriendship>mockFriendship,
        user: <IUser>mockUser
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