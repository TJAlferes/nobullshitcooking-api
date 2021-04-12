import { Socket } from 'socket.io';

import { pool } from '../../../../src/lib/connections/mysql';  // just mock like in others?
import { Friendship, IFriendship } from '../../../../src/access/mysql';
import { IChatRoom } from '../../../../src/access/redis/ChatRoom';
import { IChatUser } from '../../../../src/access/redis/ChatUser';
import {
  disconnecting,
  IDisconnecting
} from '../../../../src/chat/handlers/disconnecting';

jest.mock('../../../../src/access/mysql', () => ({
  Friendship: jest.fn().mockImplementation(() => ({
    viewAccepted: mockViewAccepted
  }))
}));
let mockViewAccepted = jest.fn();

const mockRemoveUser = jest.fn();
const mockChatRoom: Partial<IChatRoom> = {removeUser: mockRemoveUser};

let mockGetSocketId = jest.fn();
const mockRemove = jest.fn();

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

let mockChatUser: Partial<IChatUser>;
let mockFriendship: IFriendship;

let currParams: IDisconnecting;

afterEach(() => {
  jest.clearAllMocks();
});

describe('disconnecting handler', () => {

  describe('when friends are offline', () => {
    beforeAll(() => {
      mockGetSocketId = jest.fn().mockResolvedValue(undefined);
      mockViewAccepted =
        jest.fn().mockResolvedValue([{username: "Jack"}, {username: "Jill"}]);
      mockChatUser = {getSocketId: mockGetSocketId, remove: mockRemove};
      mockFriendship = new Friendship(pool);
      currParams = {
        ...params,
        chatRoom: <IChatRoom>mockChatRoom,
        chatUser: <IChatUser>mockChatUser,
        friendship: <IFriendship>mockFriendship
      };
    });

    it('uses socket.broadcast.to with RemoveUser event correctly', async () => {
      await disconnecting(currParams);
      expect(params.socket.broadcast.to).toHaveBeenCalledWith("room");
    });

    it('uses socket.broadcast.to.emit with RemoveUser event correctly', async () => {
      await disconnecting(currParams);
      expect(params.socket.broadcast.emit)
        .toHaveBeenCalledWith('RemoveUser', "self");
    });

    it('uses removeUser correctly', async () => {
      await disconnecting(currParams);
      expect(mockRemoveUser).toHaveBeenCalledWith("self", "room");
    });

    it('uses viewMyAcceptedFriendships correctly', async () => {
      await disconnecting(currParams);
      expect(mockViewAccepted).toHaveBeenCalledWith(150);
    });

    it('uses getSocketId correctly', async () => {
      await disconnecting(currParams);
      expect(mockGetSocketId).toHaveBeenCalledWith("Jack");
      expect(mockGetSocketId).toHaveBeenCalledWith("Jill");
    });

    it('uses remove correctly', async () => {
      await disconnecting(currParams);
      expect(mockRemove).toHaveBeenCalledWith(150);
    });
  });

  describe('when friends are online', () => {
    beforeAll(() => {
      mockGetSocketId = jest.fn().mockResolvedValue("123456789");
      mockViewAccepted = jest.fn()
        .mockResolvedValue([{username: "Jack"}, {username: "Jill"}]);
      mockChatUser = {getSocketId: mockGetSocketId, remove: mockRemove};
      mockFriendship = new Friendship(pool);
      currParams = {
        ...params,
        chatRoom: <IChatRoom>mockChatRoom,
        chatUser: <IChatUser>mockChatUser,
        friendship: <IFriendship>mockFriendship
      };
    });

    it ('uses socket.broadcast.to with RemoveUser event correctly', async () => {
      await disconnecting(currParams);
      expect(params.socket.broadcast.to).toHaveBeenCalledWith("room");
    });

    it ('uses socket.broadcast.to.emit with RemoveUser event correctly', async () => {
      await disconnecting(currParams);
      expect(params.socket.broadcast.emit)
        .toHaveBeenCalledWith('RemoveUser', "self");
    });

    it('uses removeUser correctly', async () => {
      await disconnecting(currParams);
      expect(mockRemoveUser).toHaveBeenCalledWith("self", "room");
    });

    it('uses viewAccepted correctly', async () => {
      await disconnecting(currParams);
      expect(mockViewAccepted).toHaveBeenCalledWith("self");
    });

    it('uses getSocketId correctly', async () => {
      await disconnecting(currParams);
      expect(mockGetSocketId).toHaveBeenCalledWith("Jack");
      expect(mockGetSocketId).toHaveBeenCalledWith("Jill");
    });

    it ('uses socket.broadcast.to with ShowOffline event correctly', async () => {
      await disconnecting(currParams);
      expect(params.socket.broadcast.to).toHaveBeenCalledWith("123456789");
    });

    it ('uses socket.broadcast.to.emit with ShowOffline event correctly', async () => {
      await disconnecting(currParams);
      expect(params.socket.broadcast.emit)
        .toHaveBeenCalledWith('ShowOffline', "self");
    });

    it('uses remove correctly', async () => {
      await disconnecting(currParams);
      expect(mockRemove).toHaveBeenCalledWith(150);
    });
  });

});