import { Socket } from 'socket.io';

import { IFriendship } from '../../../src/access/mysql';
import { IChatStore } from '../../../src/access/redis';
import { getOnlineFriends, IGetOnlineFriends } from '../../../src/chat';

const mockViewAccepted = jest.fn().mockResolvedValue(["Jack", "Jill"]);
const mockFriendship: Partial<IFriendship> = {viewAccepted: mockViewAccepted};

const rooms = new Set<string>();
rooms.add("room");

const mockBroadcast: any =
  {emit: jest.fn(), to: jest.fn((room: string) => mockBroadcast)};

const mockSocket: Partial<Socket> = {
  broadcast: <Socket>mockBroadcast,
  emit: jest.fn().mockReturnValue(true),
  rooms
};

let mockGetUserSocketId = jest.fn();
let mockChatStore: Partial<IChatStore>;

const initialParams = {
  username: "self",
  socket: <Socket>mockSocket,
  nobscFriendship: <IFriendship>mockFriendship
};

let params: IGetOnlineFriends;

afterEach(() => {
  jest.clearAllMocks();
});

describe('getOnline handler', () => {
  describe('when friends are offline', () => {
    beforeAll(() => {
      mockGetUserSocketId = jest.fn().mockResolvedValue(undefined);
      mockChatStore = {getUserSocketId: mockGetUserSocketId};
      params = {...initialParams, chatStore: <IChatStore>mockChatStore};
    });

    it('uses Friendship.viewAccepted', async () => {
      await getOnlineFriends(params);
      expect(mockViewAccepted).toHaveBeenCalledWith(150);
    });

    it('uses getUserSocketId', async () => {
      await getOnlineFriends(params);
      expect(mockGetUserSocketId).toHaveBeenCalledWith("Jack");
      expect(mockGetUserSocketId).toHaveBeenCalledWith("Jill");
    });

    it('uses socket.emit with OnlineFriends event', async () => {
      await getOnlineFriends(params);
      // TO DO: finish
    });
  });

  describe('when friends are online', () => {
    beforeAll(() => {
      mockGetUserSocketId = jest.fn().mockResolvedValue("123456789");
      mockChatStore = {getUserSocketId: mockGetUserSocketId};
      params = {...initialParams, chatStore: <IChatStore>mockChatStore};
    });

    it('uses Friendship.viewAccepted', async () => {
      await getOnlineFriends(params);
      expect(mockViewAccepted).toHaveBeenCalledWith(150);
    });

    it('uses getUserSocketId', async () => {
      await getOnlineFriends(params);
      expect(mockGetUserSocketId).toHaveBeenCalledWith("Jack");
      expect(mockGetUserSocketId).toHaveBeenCalledWith("Jill");
    });

    it('uses socket.broadcast.to with ShowOnline event', async () => {
      await getOnlineFriends(params);
      expect(params.socket.broadcast.to).toHaveBeenCalledWith("123456789");
    });

    it('uses socket.broadcast.emit with FriendCameOnline event', async () => {
      await getOnlineFriends(params);
      expect(params.socket.broadcast.emit)
        .toHaveBeenCalledWith('FriendCameOnline', "self");
    });

    it('uses socket.emit with OnlineFriends event', async () => {
      await getOnlineFriends(params);
      expect(params.socket.emit)
        .toHaveBeenCalledWith('OnlineFriends', ["Jack", "Jill"]);
    });
  });
});