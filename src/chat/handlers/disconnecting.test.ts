import { Socket } from 'socket.io';

import { pool } from '../../lib/connections/mysqlPoolConnection';
import { IFriendship, Friendship } from '../../mysql-access/Friendship';
import { IMessengerRoom } from '../../redis-access/MessengerRoom';
import { IMessengerUser } from '../../redis-access/MessengerUser';
import { ChatUser  } from '../entities/ChatUser';
import { disconnecting } from './disconnecting';

jest.mock('../../mysql-access/Friendship', () => ({
  Friendship: jest.fn().mockImplementation(() => ({
    viewAccepted: mockViewAccepted
  }))
}));
let mockViewAccepted = jest.fn();

const mockRemoveUserFromRoom = jest.fn();
const mockMessengerRoom: Partial<IMessengerRoom> = {
  removeUserFromRoom: mockRemoveUserFromRoom
};

let mockGetUserSocketId = jest.fn();
const mockRemoveUser = jest.fn();

jest.mock('../entities/ChatUser');
const mockChatUser = ChatUser as jest.Mocked<typeof ChatUser>;

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
  reason: "Some reason.",
  id: 150,
  username: "Name",
  avatar: "Name123",
  socket: <Socket>mockSocket
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('disconnecting handler', () => {

  describe('when friends are offline', () => {
    it ('uses socket.broadcast.to with RemoveUser event correctly', async () => {
      mockGetUserSocketId = jest.fn().mockResolvedValue(undefined);
      mockViewAccepted = jest.fn()
        .mockResolvedValue([{user_id: 48}, {user_id: 84}]);
      const mockMessengerUser: Partial<IMessengerUser> = {
        getUserSocketId: mockGetUserSocketId,
        removeUser: mockRemoveUser
      };
      const mockNobscFriendship = new Friendship(pool);
      await disconnecting({
        ...params,
        messengerRoom: <IMessengerRoom>mockMessengerRoom,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship
      });
      expect(params.socket.broadcast.to).toHaveBeenCalledWith("someRoom");
    });

    it ('uses socket.broadcast.to.emit with RemoveUser event correctly', async () => {
      mockGetUserSocketId = jest.fn().mockResolvedValue(undefined);
      mockViewAccepted = jest.fn()
        .mockResolvedValue([{user_id: 48}, {user_id: 84}]);
      const mockMessengerUser: Partial<IMessengerUser> = {
        getUserSocketId: mockGetUserSocketId,
        removeUser: mockRemoveUser
      };
      const mockNobscFriendship = new Friendship(pool);
      await disconnecting({
        ...params,
        messengerRoom: <IMessengerRoom>mockMessengerRoom,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship
      });
      expect(params.socket.broadcast.emit)
      .toHaveBeenCalledWith('RemoveUser', ChatUser(150, "Name", "Name123"));
    });

    it('uses removeUserFromRoom correctly', async () => {
      mockGetUserSocketId = jest.fn().mockResolvedValue(undefined);
      mockViewAccepted = jest.fn()
        .mockResolvedValue([{user_id: 48}, {user_id: 84}]);
      const mockMessengerUser: Partial<IMessengerUser> = {
        getUserSocketId: mockGetUserSocketId,
        removeUser: mockRemoveUser
      };
      const mockNobscFriendship = new Friendship(pool);
      await disconnecting({
        ...params,
        messengerRoom: <IMessengerRoom>mockMessengerRoom,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship
      });
      expect(mockRemoveUserFromRoom).toHaveBeenCalledWith(150, "someRoom");
    });

    it('uses viewMyAcceptedFriendships correctly', async () => {
      mockGetUserSocketId = jest.fn().mockResolvedValue(undefined);
      mockViewAccepted = jest.fn()
        .mockResolvedValue([{user_id: 48}, {user_id: 84}]);
      const mockMessengerUser: Partial<IMessengerUser> = {
        getUserSocketId: mockGetUserSocketId,
        removeUser: mockRemoveUser
      };
      const mockNobscFriendship = new Friendship(pool);
      await disconnecting({
        ...params,
        messengerRoom: <IMessengerRoom>mockMessengerRoom,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship
      });
      expect(mockViewAccepted).toHaveBeenCalledWith(150);
    });

    it('uses getUserSocketId correctly', async () => {
      mockGetUserSocketId = jest.fn().mockResolvedValue(undefined);
      mockViewAccepted = jest.fn()
        .mockResolvedValue([{user_id: 48}, {user_id: 84}]);
      const mockMessengerUser: Partial<IMessengerUser> = {
        getUserSocketId: mockGetUserSocketId,
        removeUser: mockRemoveUser
      };
      const mockNobscFriendship = new Friendship(pool);
      await disconnecting({
        ...params,
        messengerRoom: <IMessengerRoom>mockMessengerRoom,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship
      });
      expect(mockGetUserSocketId).toHaveBeenCalledWith(48);
      expect(mockGetUserSocketId).toHaveBeenCalledWith(84);
    });

    it('uses removeUser correctly', async () => {
      mockGetUserSocketId = jest.fn().mockResolvedValue(undefined);
      mockViewAccepted = jest.fn()
        .mockResolvedValue([{user_id: 48}, {user_id: 84}]);
      const mockMessengerUser: Partial<IMessengerUser> = {
        getUserSocketId: mockGetUserSocketId,
        removeUser: mockRemoveUser
      };
      const mockNobscFriendship = new Friendship(pool);
      await disconnecting({
        ...params,
        messengerRoom: <IMessengerRoom>mockMessengerRoom,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship
      });
      expect(mockRemoveUser).toHaveBeenCalledWith(150);
    });
  });

  describe('when friends are online', () => {
    it ('uses socket.broadcast.to with RemoveUser event correctly', async () => {
      mockGetUserSocketId = jest.fn().mockResolvedValue("123456789");
      mockViewAccepted = jest.fn()
        .mockResolvedValue([{user_id: 48}, {user_id: 84}]);
      const mockMessengerUser: Partial<IMessengerUser> = {
        getUserSocketId: mockGetUserSocketId,
        removeUser: mockRemoveUser
      };
      const mockNobscFriendship = new Friendship(pool);
      await disconnecting({
        ...params,
        messengerRoom: <IMessengerRoom>mockMessengerRoom,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship
      });
      expect(params.socket.broadcast.to).toHaveBeenCalledWith("someRoom");
    });

    it ('uses socket.broadcast.to.emit with RemoveUser event correctly', async () => {
      mockGetUserSocketId = jest.fn().mockResolvedValue("123456789");
      mockViewAccepted = jest.fn()
        .mockResolvedValue([{user_id: 48}, {user_id: 84}]);
      const mockMessengerUser: Partial<IMessengerUser> = {
        getUserSocketId: mockGetUserSocketId,
        removeUser: mockRemoveUser
      };
      const mockNobscFriendship = new Friendship(pool);
      await disconnecting({
        ...params,
        messengerRoom: <IMessengerRoom>mockMessengerRoom,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship
      });
      expect(params.socket.broadcast.emit)
      .toHaveBeenCalledWith('RemoveUser', ChatUser(150, "Name", "Name123"));
    });

    it('uses removeUserFromRoom correctly', async () => {
      mockGetUserSocketId = jest.fn().mockResolvedValue("123456789");
      mockViewAccepted = jest.fn()
        .mockResolvedValue([{user_id: 48}, {user_id: 84}]);
      const mockMessengerUser: Partial<IMessengerUser> = {
        getUserSocketId: mockGetUserSocketId,
        removeUser: mockRemoveUser
      };
      const mockNobscFriendship = new Friendship(pool);
      await disconnecting({
        ...params,
        messengerRoom: <IMessengerRoom>mockMessengerRoom,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship
      });
      expect(mockRemoveUserFromRoom).toHaveBeenCalledWith(150, "someRoom");
    });

    it('uses viewMyAcceptedFriendships correctly', async () => {
      mockGetUserSocketId = jest.fn().mockResolvedValue("123456789");
      mockViewAccepted = jest.fn()
        .mockResolvedValue([{user_id: 48}, {user_id: 84}]);
      const mockMessengerUser: Partial<IMessengerUser> = {
        getUserSocketId: mockGetUserSocketId,
        removeUser: mockRemoveUser
      };
      const mockNobscFriendship = new Friendship(pool);
      await disconnecting({
        ...params,
        messengerRoom: <IMessengerRoom>mockMessengerRoom,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship
      });
      expect(mockViewAccepted).toHaveBeenCalledWith(150);
    });

    it('uses getUserSocketId correctly', async () => {
      mockGetUserSocketId = jest.fn().mockResolvedValue("123456789");
      mockViewAccepted = jest.fn()
        .mockResolvedValue([{user_id: 48}, {user_id: 84}]);
      const mockMessengerUser: Partial<IMessengerUser> = {
        getUserSocketId: mockGetUserSocketId,
        removeUser: mockRemoveUser
      };
      const mockNobscFriendship = new Friendship(pool);
      await disconnecting({
        ...params,
        messengerRoom: <IMessengerRoom>mockMessengerRoom,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship
      });
      expect(mockGetUserSocketId).toHaveBeenCalledWith(48);
      expect(mockGetUserSocketId).toHaveBeenCalledWith(84);
    });

    it ('uses socket.broadcast.to with ShowOffline event correctly', async () => {
      mockGetUserSocketId = jest.fn().mockResolvedValue("123456789");
      mockViewAccepted = jest.fn()
        .mockResolvedValue([{user_id: 48}, {user_id: 84}]);
      const mockMessengerUser: Partial<IMessengerUser> = {
        getUserSocketId: mockGetUserSocketId,
        removeUser: mockRemoveUser
      };
      const mockNobscFriendship = new Friendship(pool);
      await disconnecting({
        ...params,
        messengerRoom: <IMessengerRoom>mockMessengerRoom,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship
      });
      expect(params.socket.broadcast.to).toHaveBeenCalledWith("123456789");
    });

    it ('uses socket.broadcast.to.emit with ShowOffline event correctly', async () => {
      mockGetUserSocketId = jest.fn().mockResolvedValue("123456789");
      mockViewAccepted = jest.fn()
        .mockResolvedValue([{user_id: 48}, {user_id: 84}]);
      const mockMessengerUser: Partial<IMessengerUser> = {
        getUserSocketId: mockGetUserSocketId,
        removeUser: mockRemoveUser
      };
      const mockNobscFriendship = new Friendship(pool);
      await disconnecting({
        ...params,
        messengerRoom: <IMessengerRoom>mockMessengerRoom,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship
      });
      expect(params.socket.broadcast.emit)
      .toHaveBeenCalledWith('ShowOffline', ChatUser(150, "Name", "Name123"));
    });

    it('uses removeUser correctly', async () => {
      mockGetUserSocketId = jest.fn().mockResolvedValue("123456789");
      mockViewAccepted = jest.fn()
        .mockResolvedValue([{user_id: 48}, {user_id: 84}]);
      const mockMessengerUser: Partial<IMessengerUser> = {
        getUserSocketId: mockGetUserSocketId,
        removeUser: mockRemoveUser
      };
      const mockNobscFriendship = new Friendship(pool);
      await disconnecting({
        ...params,
        messengerRoom: <IMessengerRoom>mockMessengerRoom,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship
      });
      expect(mockRemoveUser).toHaveBeenCalledWith(150);
    });
  });

});