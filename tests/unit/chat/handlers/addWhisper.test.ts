import { Socket } from 'socket.io';

import { pool } from '../../../../src/lib/connections/mysqlPoolConnection';
import { IFriendship, Friendship } from '../../../../src/mysql-access/Friendship';
import { IUser, User } from '../../../../src/mysql-access/User';
import { IMessengerUser } from '../../../../src/redis-access/MessengerUser';
import { ChatUser } from '../../../../src/chat/entities/ChatUser';
import { ChatWhisper } from '../../../../src/chat/entities/ChatWhisper';
import { addWhisper } from '../../../../src/chat/handlers/addWhisper';

jest.mock('../../../../src/mysql-access/Friendship', () => ({
  Friendship: jest.fn().mockImplementation(() => ({
    viewBlocked: mockViewBlocked
  }))
}));
let mockViewBlocked = jest.fn();

jest.mock('../../../../src/mysql-access/User', () => ({
  User: jest.fn().mockImplementation(() => ({getByName: mockGetByName}))
}));
let mockGetByName = jest.fn();

let mockGetSocketId = jest.fn();

jest.mock('../../../../src/chat/entities/ChatUser');
const mockChatUser = ChatUser as jest.Mocked<typeof ChatUser>;

jest.mock('../../../../src/chat/entities/ChatWhisper');
const mockChatWhisper = ChatWhisper as jest.Mocked<typeof ChatWhisper>;

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
  text: "howdy",
  to: "Buddy",
  id: 150,
  username: "Name",
  avatar: "Name123",
  socket: <Socket>mockSocket
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('addWhisper handler', () => {

  describe('when user being whispered does not exist', () => {
    const mockMessengerUser: Partial<IMessengerUser> =
      {getSocketId: mockGetSocketId};
    const mockNobscFriendship = new Friendship(pool);
    const mockNobscUser = new User(pool);

    beforeAll(() => {
      mockGetByName = jest.fn().mockResolvedValue([[]]);
    });

    it('uses getUserByName correctly', async () => {
      await addWhisper({
        ...params,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship,
        nobscUser: <IUser>mockNobscUser
      });
      expect(mockGetByName).toHaveBeenCalledWith("Buddy");
    });

    it('uses socket.emit', async () => {
      await addWhisper({
        ...params,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship,
        nobscUser: <IUser>mockNobscUser
      });
      expect(params.socket.emit)
        .toHaveBeenCalledWith('FailedWhisper', 'User not found.');
    });

    // these may be wrong...
    it('returns correctly', async () => {
      const actual = await addWhisper({
        ...params,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship,
        nobscUser: <IUser>mockNobscUser
      });
      expect(actual).toEqual(true);
    });
  });

  describe('when user being whispered blocked you', () => {
    const mockMessengerUser: Partial<IMessengerUser> =
      {getSocketId: mockGetSocketId};
    const mockNobscFriendship = new Friendship(pool);
    const mockNobscUser = new User(pool);

    beforeAll(() => {
      mockGetByName = jest.fn().mockResolvedValue([[{id: 999}]]);
      mockViewBlocked = jest.fn().mockResolvedValue([[{user_id: 150}]]);
    });

    it('uses viewMyBlockedUsers correctly', async () => {
      await addWhisper({
        ...params,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship,
        nobscUser: <IUser>mockNobscUser
      });
      expect(mockViewBlocked).toHaveBeenCalledWith(999);
    });

    it('uses socket.emit', async () => {
      await addWhisper({
        ...params,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship,
        nobscUser: <IUser>mockNobscUser
      });
      expect(params.socket.emit)
        .toHaveBeenCalledWith('FailedWhisper', 'User not found.');
    });

    it('returns correctly', async () => {
      const actual = await addWhisper({
        ...params,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship,
        nobscUser: <IUser>mockNobscUser
      });
      expect(actual).toEqual(true);
    });
  });

  describe('when user being whispered is offline', () => {
    const mockMessengerUser: Partial<IMessengerUser> =
      {getSocketId: mockGetSocketId};
    const mockNobscFriendship = new Friendship(pool);
    const mockNobscUser = new User(pool);

    beforeAll(() => {
      mockGetByName = jest.fn().mockResolvedValue([[{id: 999}]]);
      mockViewBlocked = jest.fn().mockResolvedValue([[]]);
      mockGetSocketId = jest.fn().mockResolvedValue(undefined);
    });

    it('uses getSocketId correctly', async () => {
      await addWhisper({
        ...params,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship,
        nobscUser: <IUser>mockNobscUser
      });
      expect(mockGetSocketId).toHaveBeenCalledWith(999);
    });

    it('uses socket.emit', async () => {
      await addWhisper({
        ...params,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship,
        nobscUser: <IUser>mockNobscUser
      });
      expect(params.socket.emit)
        .toHaveBeenCalledWith('FailedWhisper', 'User not found.');
    });

    it('returns correctly', async () => {
      const actual = await addWhisper({
        ...params,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship,
        nobscUser: <IUser>mockNobscUser
      });
      expect(actual).toEqual(true);
    });
  });

  describe('when okay', () => {
    const mockMessengerUser: Partial<IMessengerUser> =
      {getSocketId: mockGetSocketId};
    const mockNobscFriendship = new Friendship(pool);
    const mockNobscUser = new User(pool);

    beforeAll(() => {
      mockGetByName = jest.fn().mockResolvedValue([[{id: 999}]]);
      mockViewBlocked = jest.fn().mockResolvedValue([[]]);
      mockGetSocketId = jest.fn().mockResolvedValue("123456789");
    });

    it('uses ChatUser correctly', async () => {
      await addWhisper({
        ...params,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship,
        nobscUser: <IUser>mockNobscUser
      });
      expect(mockChatUser).toHaveBeenCalledWith(150, "Name", "Name123");
    });
  
    it('uses Whisper correctly', async () => {
      await addWhisper({
        ...params,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship,
        nobscUser: <IUser>mockNobscUser
      });
      expect(mockChatWhisper).toHaveBeenCalledWith(
        "howdy",
        "Buddy",
        ChatUser(150, "Name", "Name123")
      );
    });

    it ('uses socket.broadcast.to correctly', async () => {
      await addWhisper({
        ...params,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship,
        nobscUser: <IUser>mockNobscUser
      });
      expect(params.socket.broadcast.to).toHaveBeenCalledWith("123456789");
    });

    it ('uses socket.broadcast.to.emit correctly', async () => {
      await addWhisper({
        ...params,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship,
        nobscUser: <IUser>mockNobscUser
      });
      expect(params.socket.broadcast.emit).toHaveBeenCalledWith(
        'AddWhisper',
        ChatWhisper(
          "howdy",
          "Buddy",
          ChatUser(150, "Name", "Name123")
        )
      );
    });

    it ('uses socket.emit with AddWhisper event correctly', async () => {
      await addWhisper({
        ...params,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship,
        nobscUser: <IUser>mockNobscUser
      });
      expect(params.socket.emit).toHaveBeenCalledWith(
        'AddWhisper',
        ChatWhisper(
          "howdy",
          "Buddy",
          ChatUser(150, "Name", "Name123")
        )
      );
    });
  });

});