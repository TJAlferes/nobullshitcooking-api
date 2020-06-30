import { Socket } from 'socket.io';

import { IFriendship } from '../../mysql-access/Friendship';
import { IMessengerUser } from '../../redis-access/MessengerUser';
import { ChatUser } from '../entities/ChatUser';
import { getOnline } from './getOnline';

const mockViewMyAcceptedFriendships = jest.fn().mockResolvedValue([
  {user_id: 48, username: "Jack", avatar: "Jack123"},
  {user_id: 84, username: "Jill", avatar: "Jill123"}
]);
const mockNobscFriendship: Partial<IFriendship> = {
  viewMyAcceptedFriendships: mockViewMyAcceptedFriendships
};

let mockGetUserSocketId = jest.fn();

const mockBroadcast: any = {
  emit: jest.fn(),
  to: jest.fn((room: string) => mockBroadcast)
};

const mockSocket: Partial<Socket> = {
  broadcast: <Socket>mockBroadcast,
  emit: jest.fn().mockReturnValue(true),
  rooms: {"someRoom": "someRoom"}
};

const params = {
  userId: 150,
  username: "Name",
  avatar: "Name123",
  socket: <Socket>mockSocket,
  nobscFriendship: <IFriendship>mockNobscFriendship
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('getOnline handler', () => {

  describe('when friends are offline', () => {
    it ('uses viewMyAcceptedFriendships correctly', async () => {
      mockGetUserSocketId = jest.fn().mockResolvedValue(undefined);
      const mockMessengerUser: Partial<IMessengerUser> = {
        getUserSocketId: mockGetUserSocketId
      };
      await getOnline({
        ...params,
        messengerUser: <IMessengerUser>mockMessengerUser
      });
      expect(mockViewMyAcceptedFriendships).toHaveBeenCalledWith(150);
    });

    it ('uses getUserSocketId correctly', async () => {
      mockGetUserSocketId = jest.fn().mockResolvedValue(undefined);
      const mockMessengerUser: Partial<IMessengerUser> = {
        getUserSocketId: mockGetUserSocketId
      };
      await getOnline({
        ...params,
        messengerUser: <IMessengerUser>mockMessengerUser
      });
      expect(mockGetUserSocketId).toHaveBeenCalledWith(48);
      expect(mockGetUserSocketId).toHaveBeenCalledWith(84);
    });

    it ('uses socket.emit with GetOnline event correctly', async () => {
      mockGetUserSocketId = jest.fn().mockResolvedValue(undefined);
      const mockMessengerUser: Partial<IMessengerUser> = {
        getUserSocketId: mockGetUserSocketId
      };
      await getOnline({
        ...params,
        messengerUser: <IMessengerUser>mockMessengerUser
      });

    });
  });

  describe('when friends are online', () => {
    it ('uses viewMyAcceptedFriendships correctly', async () => {
      mockGetUserSocketId = jest.fn().mockResolvedValue("123456789");
      const mockMessengerUser: Partial<IMessengerUser> = {
        getUserSocketId: mockGetUserSocketId
      };
      await getOnline({
        ...params,
        messengerUser: <IMessengerUser>mockMessengerUser
      });
      expect(mockViewMyAcceptedFriendships).toHaveBeenCalledWith(150);
    });

    it ('uses getUserSocketId correctly', async () => {
      mockGetUserSocketId = jest.fn().mockResolvedValue("123456789");
      const mockMessengerUser: Partial<IMessengerUser> = {
        getUserSocketId: mockGetUserSocketId
      };
      await getOnline({
        ...params,
        messengerUser: <IMessengerUser>mockMessengerUser
      });
      expect(mockGetUserSocketId).toHaveBeenCalledWith(48);
      expect(mockGetUserSocketId).toHaveBeenCalledWith(84);
    });

    it ('uses socket.broadcast.to with ShowOnline event correctly', async () => {
      mockGetUserSocketId = jest.fn().mockResolvedValue("123456789");
      const mockMessengerUser: Partial<IMessengerUser> = {
        getUserSocketId: mockGetUserSocketId
      };
      await getOnline({
        ...params,
        messengerUser: <IMessengerUser>mockMessengerUser
      });
      expect(params.socket.broadcast.to).toHaveBeenCalledWith("123456789");
    });

    it ('uses socket.broadcast.emit with ShowOnline event correctly', async () => {
      mockGetUserSocketId = jest.fn().mockResolvedValue("123456789");
      const mockMessengerUser: Partial<IMessengerUser> = {
        getUserSocketId: mockGetUserSocketId
      };
      await getOnline({
        ...params,
        messengerUser: <IMessengerUser>mockMessengerUser
      });
      expect(params.socket.broadcast.emit)
      .toHaveBeenCalledWith('ShowOnline', ChatUser(150, "Name", "Name123"));
    });

    it ('uses socket.emit with GetOnline event correctly', async () => {
      mockGetUserSocketId = jest.fn().mockResolvedValue("123456789");
      const mockMessengerUser: Partial<IMessengerUser> = {
        getUserSocketId: mockGetUserSocketId
      };
      await getOnline({
        ...params,
        messengerUser: <IMessengerUser>mockMessengerUser
      });
      expect(params.socket.emit).toHaveBeenCalledWith('GetOnline', [
        {userId: 48, username: "Jack", avatar: "Jack123"},
        {userId: 84, username: "Jill", avatar: "Jill123"}
      ]);
    });
  });

});