import { Socket } from 'socket.io';

import { pool } from '../../lib/connections/mysqlPoolConnection';
import { IFriendship } from '../../mysql-access/Friendship';
import { IUser, User } from '../../mysql-access/User';
import { IMessengerUser } from '../../redis-access/MessengerUser';
import { ChatUser } from '../entities/ChatUser';
import { Whisper } from '../entities/Whisper';
import { addWhisper } from './addWhisper';

let mockViewMyBlockedUsers = jest.fn().mockResolvedValue([[{user_id: 999}]]);
const mockNobscFriendship: Partial<IFriendship> = {
  viewMyBlockedUsers: mockViewMyBlockedUsers
};

let mockGetUserByName = jest.fn();
jest.mock('../../mysql-access/User', () => ({
  User: jest.fn().mockImplementation(() => ({
    getUserByName: mockGetUserByName
  }))
}));

let mockGetUserSocketId = jest.fn().mockResolvedValue("123456789");
const mockMessengerUser: Partial<IMessengerUser> = {
  getUserSocketId: mockGetUserSocketId
};

jest.mock('../entities/ChatUser');
const mockChatUser = ChatUser as jest.Mocked<typeof ChatUser>;

jest.mock('../entities/Whisper');
const mockWhisper = Whisper as jest.Mocked<typeof Whisper>;

const mockBroadcast: any = {
  emit: jest.fn(),
  to: jest.fn((room: string) => mockBroadcast)
};

const mockSocket: Partial<Socket> = {
  broadcast: <Socket>mockBroadcast,
  emit: jest.fn().mockReturnValue(true),
  join: jest.fn(),
  leave: jest.fn(),
  rooms: {"someRoom": "someRoom"}
};

const params = {
  whisperText: "howdy",
  to: "Buddy",
  userId: 150,
  username: "Name",
  avatar: "Name123",
  socket: <Socket>mockSocket,
  messengerUser: <IMessengerUser>mockMessengerUser,
  nobscFriendship: <IFriendship>mockNobscFriendship,
  //nobscUser: <IUser>mockNobscUser
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('addWhisper handler', () => {

  describe('when user being whispered does not exist', () => {
    it('uses getUserByName correctly', async () => {
      mockGetUserByName = jest.fn().mockResolvedValue([[]]);
      const mockNobscUser = new User(pool);
      await addWhisper({...params, nobscUser: <IUser>mockNobscUser});
      expect(mockGetUserByName).toHaveBeenCalledWith("Buddy");
    });

    it('uses socket.emit', async () => {
      mockGetUserByName = jest.fn().mockResolvedValue([[]]);
      const mockNobscUser = new User(pool);
      await addWhisper({...params, nobscUser: <IUser>mockNobscUser});
      expect(params.socket.emit)
      .toHaveBeenCalledWith('FailedWhisper', 'User not found.');
    });

    // these may be wrong...
    it('returns correctly', async () => {
      mockGetUserByName = jest.fn().mockResolvedValue([[]]);
      const mockNobscUser = new User(pool);
      const actual = await addWhisper({
        ...params,
        nobscUser: <IUser>mockNobscUser
      });
      expect(actual).toEqual(true);
    });
  });

  describe('when user being whispered blocked you', () => {
    it('uses viewMyBlockedUsers correctly', async () => {
      mockGetUserByName = jest.fn().mockResolvedValue([[{user_id: 999}]]);
      mockViewMyBlockedUsers = jest.fn().mockResolvedValue([[{user_id: 999}]]);
      const mockNobscUser = new User(pool);
      await addWhisper({...params, nobscUser: <IUser>mockNobscUser});
      expect(mockViewMyBlockedUsers).toHaveBeenCalledWith("Buddy");
    });

    it('uses socket.emit', async () => {
      mockGetUserByName = jest.fn().mockResolvedValue([[{user_id: 999}]]);
      mockViewMyBlockedUsers = jest.fn().mockResolvedValue([[{user_id: 999}]]);
      const mockNobscUser = new User(pool);
      await addWhisper({...params, nobscUser: <IUser>mockNobscUser});
      expect(params.socket.emit)
      .toHaveBeenCalledWith('FailedWhisper', 'User not found.');
    });

    it('returns correctly', async () => {
      mockGetUserByName = jest.fn().mockResolvedValue([[{user_id: 999}]]);
      mockViewMyBlockedUsers = jest.fn().mockResolvedValue([[{user_id: 999}]]);
      const mockNobscUser = new User(pool);
      const actual = await addWhisper({
        ...params,
        nobscUser: <IUser>mockNobscUser
      });
      expect(actual).toEqual(true);
    });
  });

  describe('when user being whispered is offline', () => {
    it('uses getUserSocketId correctly', async () => {
      mockGetUserByName = jest.fn().mockResolvedValue([[{user_id: 999}]]);
      mockViewMyBlockedUsers = jest.fn().mockResolvedValue([[{user_id: 999}]]);
      mockGetUserSocketId = jest.fn().mockResolvedValue(undefined);
      const mockNobscUser = new User(pool);
      await addWhisper({...params, nobscUser: <IUser>mockNobscUser});
      expect(mockGetUserSocketId).toHaveBeenCalledWith("Buddy");
    });

    it('uses socket.emit', async () => {
      mockGetUserByName = jest.fn().mockResolvedValue([[{user_id: 999}]]);
      mockViewMyBlockedUsers = jest.fn().mockResolvedValue([[{user_id: 999}]]);
      mockGetUserSocketId = jest.fn().mockResolvedValue(undefined);
      const mockNobscUser = new User(pool);
      await addWhisper({...params, nobscUser: <IUser>mockNobscUser});
      expect(params.socket.emit)
      .toHaveBeenCalledWith('FailedWhisper', 'User not found.');
    });

    it('returns correctly', async () => {
      mockGetUserByName = jest.fn().mockResolvedValue([[{user_id: 999}]]);
      mockViewMyBlockedUsers = jest.fn().mockResolvedValue([[{user_id: 999}]]);
      mockGetUserSocketId = jest.fn().mockResolvedValue(undefined);
      const mockNobscUser = new User(pool);
      const actual = await addWhisper({
        ...params,
        nobscUser: <IUser>mockNobscUser
      });
      expect(actual).toEqual(true);
    });
  });

  describe('when okay', () => {
    it('uses ChatUser correctly', async () => {
      mockGetUserByName = jest.fn().mockResolvedValue([[{user_id: 999}]]);
      mockViewMyBlockedUsers = jest.fn().mockResolvedValue([[{user_id: 999}]]);
      mockGetUserSocketId = jest.fn().mockResolvedValue("123456789");
      const mockNobscUser = new User(pool);
      await addWhisper({...params, nobscUser: <IUser>mockNobscUser});
      expect(mockChatUser).toHaveBeenCalledWith(150, "Name", "Name123");
    });
  
    it('uses Whisper correctly', async () => {
      mockGetUserByName = jest.fn().mockResolvedValue([[{user_id: 999}]]);
      mockViewMyBlockedUsers = jest.fn().mockResolvedValue([[{user_id: 999}]]);
      mockGetUserSocketId = jest.fn().mockResolvedValue("123456789");
      const mockNobscUser = new User(pool);
      await addWhisper({...params, nobscUser: <IUser>mockNobscUser});
      expect(mockWhisper).toHaveBeenCalledWith(
        "howdy",
        "Buddy",
        ChatUser(150, "Name", "Name123")
      );
    });

    it ('uses socket.broadcast.to correctly', async () => {
      mockGetUserByName = jest.fn().mockResolvedValue([[{user_id: 999}]]);
      mockViewMyBlockedUsers = jest.fn().mockResolvedValue([[{user_id: 999}]]);
      mockGetUserSocketId = jest.fn().mockResolvedValue("123456789");
      const mockNobscUser = new User(pool);
      await addWhisper({...params, nobscUser: <IUser>mockNobscUser});
      expect(params.socket.broadcast.to)
      .toHaveBeenCalledWith("123456789");
    });

    it ('uses socket.broadcast.to.emit correctly', async () => {
      mockGetUserByName = jest.fn().mockResolvedValue([[{user_id: 999}]]);
      mockViewMyBlockedUsers = jest.fn().mockResolvedValue([[{user_id: 999}]]);
      mockGetUserSocketId = jest.fn().mockResolvedValue("123456789");
      const mockNobscUser = new User(pool);
      await addWhisper({...params, nobscUser: <IUser>mockNobscUser});
      expect(params.socket.broadcast.emit)
      .toHaveBeenCalledWith(
        'AddWhisper',
        Whisper(
          "howdy",
          "Buddy",
          ChatUser(150, "Name", "Name123")
        )
      );
    });

    it ('uses socket.emit with AddWhisper event correctly', async () => {
      mockGetUserByName = jest.fn().mockResolvedValue([[{user_id: 999}]]);
      mockViewMyBlockedUsers = jest.fn().mockResolvedValue([[{user_id: 999}]]);
      mockGetUserSocketId = jest.fn().mockResolvedValue("123456789");
      const mockNobscUser = new User(pool);
      await addWhisper({...params, nobscUser: <IUser>mockNobscUser});
      expect(params.socket.emit)
      .toHaveBeenCalledWith(
        'AddWhisper',
        Whisper(
          "howdy",
          "Buddy",
          ChatUser(150, "Name", "Name123")
        )
      );
    });
  });

});