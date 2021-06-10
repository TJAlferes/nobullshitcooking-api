import { Socket } from 'socket.io';

import { Friendship, IFriendship } from '../../../src/access/mysql';
import { IChatStore } from '../../../src/access/redis';
import { disconnecting, IDisconnecting } from '../../../src/chat';
import { pool } from '../../../src/lib/connections/mysql';  // mock like others?

jest.mock('../../../../src/access/mysql', () => ({
  Friendship: jest.fn().mockImplementation(() => ({
    viewAccepted: mockViewAccepted
  }))
}));
let mockViewAccepted = jest.fn();

const mockRemoveUserFromRoom = jest.fn();
const mockChatStore: Partial<IChatStore> =
  {removeUserFromRoom: mockRemoveUserFromRoom};

let mockGetUserSocketId = jest.fn();
const mockDeleteUser = jest.fn();

const mockBroadcast: any = {
  emit: jest.fn(),
  to: jest.fn((room: string) => mockBroadcast)
};

const rooms = new Set<string>();
rooms.add("room");
const mockSocket: Partial<Socket> = {
  broadcast: <Socket>mockBroadcast,
  emit: jest.fn().mockReturnValue(true),
  join: jest.fn(),
  leave: jest.fn(),
  rooms
};

const params = {
  reason: "reason",
  username: "self",
  socket: <Socket>mockSocket
};

let mockFriendship: IFriendship;

let currParams: IDisconnecting;

afterEach(() => {
  jest.clearAllMocks();
});

describe('disconnecting handler', () => {
  describe('when friends are offline', () => {
    beforeAll(() => {
      mockGetUserSocketId = jest.fn().mockResolvedValue(undefined);
      mockViewAccepted =
        jest.fn().mockResolvedValue([{username: "Jack"}, {username: "Jill"}]);
      mockChatStore =
        {getUserSocketId: mockGetUserSocketId, deleteUser: mockDeleteUser};
      mockFriendship = new Friendship(pool);

      currParams = {
        ...params,
        chatStore: <IChatStore>mockChatStore,
        friendship: <IFriendship>mockFriendship
      };
    });

    it('uses socket.broadcast.to with RemoveUser event', async () => {
      await disconnecting(currParams);
      expect(params.socket.broadcast.to).toHaveBeenCalledWith("room");
    });

    it('uses socket.broadcast.to.emit with RemoveUser event', async () => {
      await disconnecting(currParams);
      expect(params.socket.broadcast.emit)
        .toHaveBeenCalledWith('RemoveUser', "self");
    });

    it('uses removeUserFromRoom', async () => {
      await disconnecting(currParams);
      expect(mockRemoveUserFromRoom).toHaveBeenCalledWith("self", "room");
    });

    it('uses Friendship.viewAccepted', async () => {
      await disconnecting(currParams);
      expect(mockViewAccepted).toHaveBeenCalledWith(150);
    });

    it('uses getUserSocketId', async () => {
      await disconnecting(currParams);
      expect(mockGetUserSocketId).toHaveBeenCalledWith("Jack");
      expect(mockGetUserSocketId).toHaveBeenCalledWith("Jill");
    });

    it('uses deleteUser', async () => {
      await disconnecting(currParams);
      expect(mockDeleteUser).toHaveBeenCalledWith(150);
    });
  });

  describe('when friends are online', () => {
    beforeAll(() => {
      mockGetUserSocketId = jest.fn().mockResolvedValue("123456789");
      mockViewAccepted = jest.fn()
        .mockResolvedValue([{username: "Jack"}, {username: "Jill"}]);
      mockChatStore =
        {getUserSocketId: mockGetUserSocketId, deleteUser: mockDeleteUser};
      mockFriendship = new Friendship(pool);

      currParams = {
        ...params,
        chatStore: <IChatStore>mockChatStore,
        friendship: <IFriendship>mockFriendship
      };
    });

    it ('uses socket.broadcast.to with RemoveUser event', async () => {
      await disconnecting(currParams);
      expect(params.socket.broadcast.to).toHaveBeenCalledWith("room");
    });

    it ('uses socket.broadcast.to.emit with RemoveUser event', async () => {
      await disconnecting(currParams);
      expect(params.socket.broadcast.emit)
        .toHaveBeenCalledWith('RemoveUser', "self");
    });

    it('uses removeUserFromRoom', async () => {
      await disconnecting(currParams);
      expect(mockRemoveUserFromRoom).toHaveBeenCalledWith("self", "room");
    });

    it('uses Friendship.viewAccepted', async () => {
      await disconnecting(currParams);
      expect(mockViewAccepted).toHaveBeenCalledWith("self");
    });

    it('uses getUserSocketId', async () => {
      await disconnecting(currParams);
      expect(mockGetUserSocketId).toHaveBeenCalledWith("Jack");
      expect(mockGetUserSocketId).toHaveBeenCalledWith("Jill");
    });

    it ('uses socket.broadcast.to with UserWentOffline event', async () => {
      await disconnecting(currParams);
      expect(params.socket.broadcast.to).toHaveBeenCalledWith("123456789");
    });

    it ('uses socket.broadcast.to.emit with UserWentOffline event', async () => {
      await disconnecting(currParams);
      expect(params.socket.broadcast.emit)
        .toHaveBeenCalledWith('UserWentOffline', "self");
    });

    it('uses deleteUser', async () => {
      await disconnecting(currParams);
      expect(mockDeleteUser).toHaveBeenCalledWith(150);
    });
  });
});