import { Socket } from 'socket.io';

import { pool } from '../../../../src/lib/connections/mysql';  // just mock like in others?
import { IFriendship, Friendship } from '../../../../src/access/mysql/Friendship';
import { IUser, User } from '../../../../src/access/mysql/User';
import { IMessengerUser } from '../../../../src/access/redis/MessengerUser';
import { ChatUser } from '../../../../src/chat/entities/ChatUser';
import { ChatWhisper } from '../../../../src/chat/entities/ChatWhisper';
import { IAddWhisper, addWhisper } from '../../../../src/chat/handlers/addWhisper';

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

jest.mock('../../../../src/chat/entities/ChatUser');
const mockChatUser = ChatUser as jest.Mocked<typeof ChatUser>;

jest.mock('../../../../src/chat/entities/ChatWhisper');
const mockChatWhisper = ChatWhisper as jest.Mocked<typeof ChatWhisper>;

const rooms = new Set<string>();
rooms.add("someRoom");
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
  text: "howdy",
  to: "Buddy",
  username: "Name",
  avatar: "Name123",
  socket: <Socket>mockSocket
};

let currParams: IAddWhisper;

afterEach(() => {
  jest.clearAllMocks();
});

describe('addWhisper handler', () => {

  describe('when user being whispered does not exist', () => {
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
      await addWhisper(currParams);
      expect(mockGetByName).toHaveBeenCalledWith("Buddy");
    });

    it('uses socket.emit', async () => {
      await addWhisper(currParams);
      expect(params.socket.emit)
        .toHaveBeenCalledWith('FailedWhisper', 'User not found.');
    });

    // these may be wrong...
    it('returns correctly', async () => {
      const actual = await addWhisper(currParams);
      expect(actual).toEqual(true);
    });
  });

  describe('when user being whispered blocked you', () => {
    beforeAll(() => {
      mockMessengerUser = {getSocketId: mockGetSocketId};

      mockViewBlocked = jest.fn().mockResolvedValue([[{username: "Buddy"}]]);
      mockNobscFriendship = new Friendship(pool);

      mockGetByName = jest.fn().mockResolvedValue([[{username: "Buddy"}]]);
      mockNobscUser = new User(pool);

      currParams = {
        ...params,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship,
        nobscUser: <IUser>mockNobscUser
      };
    });

    it('uses viewMyBlockedUsers correctly', async () => {
      await addWhisper(currParams);
      expect(mockViewBlocked).toHaveBeenCalledWith("Buddy");
    });

    it('uses socket.emit', async () => {
      await addWhisper(currParams);
      expect(params.socket.emit)
        .toHaveBeenCalledWith('FailedWhisper', 'User not found.');
    });

    it('returns correctly', async () => {
      const actual = await addWhisper(currParams);
      expect(actual).toEqual(true);
    });
  });

  describe('when user being whispered is offline', () => {
    beforeAll(() => {
      mockGetSocketId = jest.fn().mockResolvedValue(undefined);
      mockMessengerUser = {getSocketId: mockGetSocketId};

      mockViewBlocked = jest.fn().mockResolvedValue([[]]);
      mockNobscFriendship = new Friendship(pool);

      mockGetByName = jest.fn().mockResolvedValue([[{username: "Buddy"}]]);
      mockNobscUser = new User(pool);

      currParams = {
        ...params,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship,
        nobscUser: <IUser>mockNobscUser
      };
    });

    it('uses getSocketId correctly', async () => {
      await addWhisper(currParams);
      expect(mockGetSocketId).toHaveBeenCalledWith("Buddy");
    });

    it('uses socket.emit', async () => {
      await addWhisper(currParams);
      expect(params.socket.emit)
        .toHaveBeenCalledWith('FailedWhisper', 'User not found.');
    });

    it('returns correctly', async () => {
      const actual = await addWhisper(currParams);
      expect(actual).toEqual(true);
    });
  });

  describe('when okay', () => {
    beforeAll(() => {
      mockGetSocketId = jest.fn().mockResolvedValue("123456789");
      mockMessengerUser = {getSocketId: mockGetSocketId};

      mockViewBlocked = jest.fn().mockResolvedValue([[]]);
      mockNobscFriendship = new Friendship(pool);

      mockGetByName = jest.fn().mockResolvedValue([[{username: "Buddy"}]]);
      mockNobscUser = new User(pool);

      currParams = {
        ...params,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship,
        nobscUser: <IUser>mockNobscUser
      };
    });

    it('uses ChatUser correctly', async () => {
      await addWhisper(currParams);
      expect(mockChatUser).toHaveBeenCalledWith("Name", "Name123");
    });
  
    it('uses Whisper correctly', async () => {
      await addWhisper(currParams);
      expect(mockChatWhisper).toHaveBeenCalledWith(
        "howdy", "Buddy", ChatUser("Name", "Name123")
      );
    });

    it ('uses socket.broadcast.to correctly', async () => {
      await addWhisper(currParams);
      expect(params.socket.broadcast.to).toHaveBeenCalledWith("123456789");
    });

    it ('uses socket.broadcast.to.emit correctly', async () => {
      await addWhisper(currParams);
      expect(params.socket.broadcast.emit).toHaveBeenCalledWith(
        'AddWhisper',
        ChatWhisper("howdy", "Buddy", ChatUser("Name", "Name123"))
      );
    });

    it ('uses socket.emit with AddWhisper event correctly', async () => {
      await addWhisper(currParams);
      expect(params.socket.emit).toHaveBeenCalledWith(
        'AddWhisper',
        ChatWhisper("howdy", "Buddy", ChatUser("Name", "Name123"))
      );
    });
  });

});