import { Socket } from 'socket.io';

import { IFriendship } from '../../../../src/mysql-access/Friendship';
import { IMessengerUser } from '../../../../src/redis-access/MessengerUser';
import { ChatUser } from '../../../../src/chat/entities/ChatUser';
import { getOnline } from '../../../../src/chat/handlers/getOnline';

const mockViewAccepted = jest.fn().mockResolvedValue([
  {user_id: 48, username: "Jack", avatar: "Jack123"},
  {user_id: 84, username: "Jill", avatar: "Jill123"}
]);
const mockNobscFriendship: Partial<IFriendship> =
  {viewAccepted: mockViewAccepted};

const mockBroadcast: any =
  {emit: jest.fn(), to: jest.fn((room: string) => mockBroadcast)};
const mockSocket: Partial<Socket> = {
  broadcast: <Socket>mockBroadcast,
  emit: jest.fn().mockReturnValue(true),
  rooms: {"someRoom": "someRoom"}
};

let mockGetSocketId = jest.fn();
let mockMessengerUser: Partial<IMessengerUser>;

const params = {
  id: 150,
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
    beforeAll(() => {
      mockGetSocketId = jest.fn().mockResolvedValue(undefined);
      mockMessengerUser = {getSocketId: mockGetSocketId};
    });

    it ('uses viewMyAcceptedFriendships correctly', async () => {
      await getOnline({
        ...params,
        messengerUser: <IMessengerUser>mockMessengerUser
      });
      expect(mockViewAccepted).toHaveBeenCalledWith(150);
    });

    it ('uses getSocketId correctly', async () => {
      await getOnline({
        ...params,
        messengerUser: <IMessengerUser>mockMessengerUser
      });
      expect(mockGetSocketId).toHaveBeenCalledWith(48);
      expect(mockGetSocketId).toHaveBeenCalledWith(84);
    });

    it ('uses socket.emit with GetOnline event correctly', async () => {
      await getOnline({
        ...params,
        messengerUser: <IMessengerUser>mockMessengerUser
      });
      // finish
    });
  });

  describe('when friends are online', () => {
    beforeAll(() => {
      mockGetSocketId = jest.fn().mockResolvedValue("123456789");
      mockMessengerUser = {getSocketId: mockGetSocketId};
    });

    it ('uses viewMyAcceptedFriendships correctly', async () => {
      await getOnline({
        ...params,
        messengerUser: <IMessengerUser>mockMessengerUser
      });
      expect(mockViewAccepted).toHaveBeenCalledWith(150);
    });

    it ('uses getSocketId correctly', async () => {
      await getOnline({
        ...params,
        messengerUser: <IMessengerUser>mockMessengerUser
      });
      expect(mockGetSocketId).toHaveBeenCalledWith(48);
      expect(mockGetSocketId).toHaveBeenCalledWith(84);
    });

    it (
      'uses socket.broadcast.to with ShowOnline event correctly',
      async () => {
        await getOnline({
          ...params,
          messengerUser: <IMessengerUser>mockMessengerUser
        });
        expect(params.socket.broadcast.to).toHaveBeenCalledWith("123456789");
      }
    );

    it (
      'uses socket.broadcast.emit with ShowOnline event correctly',
      async () => {
        await getOnline({
          ...params,
          messengerUser: <IMessengerUser>mockMessengerUser
        });
        expect(params.socket.broadcast.emit)
        .toHaveBeenCalledWith('ShowOnline', ChatUser(150, "Name", "Name123"));
      }
    );

    it ('uses socket.emit with GetOnline event correctly', async () => {
      await getOnline({
        ...params,
        messengerUser: <IMessengerUser>mockMessengerUser
      });
      expect(params.socket.emit).toHaveBeenCalledWith('GetOnline', [
        {id: 48, username: "Jack", avatar: "Jack123"},
        {id: 84, username: "Jill", avatar: "Jill123"}
      ]);
    });
  });

});