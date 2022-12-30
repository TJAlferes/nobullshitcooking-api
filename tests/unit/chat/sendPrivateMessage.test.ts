import { Socket } from 'socket.io';

import { pool } from '../../../src/lib/connections/mysql';  // mock like others?
import { Friendship, User, IFriendship, IUser } from '../../../src/access/mysql';
import { IChatStore } from '../../../src/access/redis';
import { PrivateMessage, sendPrivateMessage, ISendPrivateMessage } from '../../../src/chat';

let mockGetUserSocketId = jest.fn();
let mockChatStore: Partial<IChatStore>;

jest.mock('../../../../src/access/mysql', () => ({
  Friendship: jest.fn().mockImplementation(() => ({viewBlocked: mockViewBlocked})),
  User:       jest.fn().mockImplementation(() => ({getByName: mockGetByName}))
}));
let mockFriendship: IFriendship;
let mockViewBlocked = jest.fn();
let mockUser: IUser;
let mockGetByName =   jest.fn();

//jest.mock('../../../../src/chat/entities/PrivateMessage');  // TO DO: change
const mockPrivateMessage = PrivateMessage as jest.Mocked<typeof PrivateMessage>;

const rooms = new Set<string>();
rooms.add("room");
const mockBroadcast: any = {emit: jest.fn(), to: jest.fn((room: string) => mockBroadcast)};
const mockSocket: Partial<Socket> = {broadcast: <Socket>mockBroadcast, emit: jest.fn().mockReturnValue(true), join: jest.fn(), leave: jest.fn(), rooms};
const initialParams = {to: "other", from: "self", text: "hello", socket: <Socket>mockSocket};

let params: ISendPrivateMessage;

afterEach(() => {
  jest.clearAllMocks();
});

describe('sendPrivateMessage handler', () => {
  describe('when user being messaged does not exist', () => {
    beforeAll(() => {
      mockChatStore =  {getUserSocketId: mockGetUserSocketId};
      mockFriendship = new Friendship(pool);
      mockGetByName =  jest.fn().mockResolvedValue([]);
      mockUser =       new User(pool);
      params =         {...initialParams, chatStore: <IChatStore>mockChatStore, friendship: <IFriendship>mockFriendship, user: <IUser>mockUser};
    });

    it('uses getUserByName', async () => {
      await sendPrivateMessage(params);
      expect(mockGetByName).toHaveBeenCalledWith("other");
    });

    it('uses socket.emit', async () => {
      await sendPrivateMessage(params);
      expect(params.socket.emit).toHaveBeenCalledWith('FailedPrivateMessage', 'User not found.');
    });

    // these may be wrong...
    it('returns', async () => {
      const actual = await sendPrivateMessage(params);
      expect(actual).toEqual(true);
    });
  });

  describe('when user being messaged blocked you', () => {
    beforeAll(() => {
      mockChatStore =   {getUserSocketId: mockGetUserSocketId};
      mockViewBlocked = jest.fn().mockResolvedValue([{username: "other"}]);
      mockFriendship =  new Friendship(pool);
      mockGetByName =   jest.fn().mockResolvedValue({id: 3, username: "other"});
      mockUser =        new User(pool);
      params =          {...initialParams, chatStore: <IChatStore>mockChatStore, friendship: <IFriendship>mockFriendship, user: <IUser>mockUser};
    });

    it('uses viewMyBlockedUsers', async () => {
      await sendPrivateMessage(params);
      expect(mockViewBlocked).toHaveBeenCalledWith("other");
    });

    it('uses socket.emit', async () => {
      await sendPrivateMessage(params);
      expect(params.socket.emit).toHaveBeenCalledWith('FailedPrivateMessage', 'User not found.');
    });

    it('returns', async () => {
      const actual = await sendPrivateMessage(params);
      expect(actual).toEqual(true);
    });
  });

  describe('when user being messaged is offline', () => {
    beforeAll(() => {
      mockGetUserSocketId = jest.fn().mockResolvedValue(undefined);
      mockChatStore =       {getUserSocketId: mockGetUserSocketId};
      mockViewBlocked =     jest.fn().mockResolvedValue([]);
      mockFriendship =      new Friendship(pool);
      mockGetByName =       jest.fn().mockResolvedValue({id: 3, username: "other"});
      mockUser =            new User(pool);
      params =              {...initialParams, chatStore: <IChatStore>mockChatStore, friendship: <IFriendship>mockFriendship, user: <IUser>mockUser};
    });

    it('uses getUserSocketId', async () => {
      await sendPrivateMessage(params);
      expect(mockGetUserSocketId).toHaveBeenCalledWith("other");
    });

    it('uses socket.emit', async () => {
      await sendPrivateMessage(params);
      expect(params.socket.emit).toHaveBeenCalledWith('FailedPrivateMessage', 'User not found.');
    });

    it('returns', async () => {
      const actual = await sendPrivateMessage(params);
      expect(actual).toEqual(true);
    });
  });

  describe('when okay', () => {
    beforeAll(() => {
      mockGetUserSocketId = jest.fn().mockResolvedValue("123456789");
      mockChatStore =       {getUserSocketId: mockGetUserSocketId};
      mockViewBlocked =     jest.fn().mockResolvedValue([]);
      mockFriendship =      new Friendship(pool);
      mockGetByName =       jest.fn().mockResolvedValue({id: 3, username: "other"});
      mockUser =            new User(pool);
      params =              {...initialParams, chatStore: <IChatStore>mockChatStore, friendship: <IFriendship>mockFriendship, user: <IUser>mockUser};
    });
  
    it('uses PrivateMessage', async () => {
      await sendPrivateMessage(params);
      expect(mockPrivateMessage).toHaveBeenCalledWith("other", "self", "hello");
    });

    it ('uses socket.broadcast.to', async () => {
      await sendPrivateMessage(params);
      expect(params.socket.broadcast.to).toHaveBeenCalledWith("123456789");
    });

    it ('uses socket.broadcast.to.emit', async () => {
      await sendPrivateMessage(params);
      expect(params.socket.broadcast.emit).toHaveBeenCalledWith('PrivateMessage', PrivateMessage("other", "self", "hello"));
    });

    it ('uses socket.emit with AddPrivateMessage event', async () => {
      await sendPrivateMessage(params);
      expect(params.socket.emit).toHaveBeenCalledWith('PrivateMessage', PrivateMessage("other", "self", "hello"));
    });
  });
});