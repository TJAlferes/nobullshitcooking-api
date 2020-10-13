import { Socket } from 'socket.io';

import { pool } from '../../../../src/lib/connections/mysql';  // just mock like in others?
import { IFriendship, Friendship } from '../../../../src/mysql-access/Friendship';
import { IMessengerRoom } from '../../../../src/redis-access/MessengerRoom';
import { IMessengerUser } from '../../../../src/redis-access/MessengerUser';
import { ChatUser  } from '../../../../src/chat/entities/ChatUser';
import { disconnecting } from '../../../../src/chat/handlers/disconnecting';

jest.mock('../../../../src/mysql-access/Friendship', () => ({
  Friendship: jest.fn().mockImplementation(() => ({
    viewAccepted: mockViewAccepted
  }))
}));
let mockViewAccepted = jest.fn();

const mockRemoveUser = jest.fn();
const mockMessengerRoom: Partial<IMessengerRoom> = {removeUser: mockRemoveUser};

let mockGetSocketId = jest.fn();
const mockRemove = jest.fn();

jest.mock('../../../../src/chat/entities/ChatUser');  // ?
//const mockChatUser = ChatUser as jest.Mocked<typeof ChatUser>;  // ?

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

let mockMessengerUser: Partial<IMessengerUser>;
let mockNobscFriendship: IFriendship;

afterEach(() => {
  jest.clearAllMocks();
});

describe('disconnecting handler', () => {

  describe('when friends are offline', () => {
    beforeAll(() => {
      mockGetSocketId = jest.fn().mockResolvedValue(undefined);
      mockViewAccepted =
        jest.fn().mockResolvedValue([{user_id: 48}, {user_id: 84}]);
      mockMessengerUser = {getSocketId: mockGetSocketId, remove: mockRemove};
      mockNobscFriendship = new Friendship(pool);
    });

    it('uses socket.broadcast.to with RemoveUser event correctly', async () => {
      await disconnecting({
        ...params,
        messengerRoom: <IMessengerRoom>mockMessengerRoom,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship
      });
      expect(params.socket.broadcast.to).toHaveBeenCalledWith("someRoom");
    });

    it('uses socket.broadcast.to.emit with RemoveUser event correctly', async () => {
      await disconnecting({
        ...params,
        messengerRoom: <IMessengerRoom>mockMessengerRoom,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship
      });
      expect(params.socket.broadcast.emit)
      .toHaveBeenCalledWith('RemoveUser', ChatUser(150, "Name", "Name123"));
    });

    it('uses removeUser correctly', async () => {
      await disconnecting({
        ...params,
        messengerRoom: <IMessengerRoom>mockMessengerRoom,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship
      });
      expect(mockRemoveUser).toHaveBeenCalledWith(150, "someRoom");
    });

    it('uses viewMyAcceptedFriendships correctly', async () => {
      await disconnecting({
        ...params,
        messengerRoom: <IMessengerRoom>mockMessengerRoom,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship
      });
      expect(mockViewAccepted).toHaveBeenCalledWith(150);
    });

    it('uses getSocketId correctly', async () => {
      await disconnecting({
        ...params,
        messengerRoom: <IMessengerRoom>mockMessengerRoom,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship
      });
      expect(mockGetSocketId).toHaveBeenCalledWith(48);
      expect(mockGetSocketId).toHaveBeenCalledWith(84);
    });

    it('uses remove correctly', async () => {
      await disconnecting({
        ...params,
        messengerRoom: <IMessengerRoom>mockMessengerRoom,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship
      });
      expect(mockRemove).toHaveBeenCalledWith(150);
    });
  });

  describe('when friends are online', () => {
    beforeAll(() => {
      mockGetSocketId = jest.fn().mockResolvedValue("123456789");
      mockViewAccepted = jest.fn()
        .mockResolvedValue([{user_id: 48}, {user_id: 84}]);
      mockMessengerUser = {getSocketId: mockGetSocketId, remove: mockRemove};
      mockNobscFriendship = new Friendship(pool);
    });

    it ('uses socket.broadcast.to with RemoveUser event correctly', async () => {
      await disconnecting({
        ...params,
        messengerRoom: <IMessengerRoom>mockMessengerRoom,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship
      });
      expect(params.socket.broadcast.to).toHaveBeenCalledWith("someRoom");
    });

    it ('uses socket.broadcast.to.emit with RemoveUser event correctly', async () => {
      await disconnecting({
        ...params,
        messengerRoom: <IMessengerRoom>mockMessengerRoom,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship
      });
      expect(params.socket.broadcast.emit)
      .toHaveBeenCalledWith('RemoveUser', ChatUser(150, "Name", "Name123"));
    });

    it('uses removeUser correctly', async () => {
      await disconnecting({
        ...params,
        messengerRoom: <IMessengerRoom>mockMessengerRoom,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship
      });
      expect(mockRemoveUser).toHaveBeenCalledWith(150, "someRoom");
    });

    it('uses viewAccepted correctly', async () => {
      await disconnecting({
        ...params,
        messengerRoom: <IMessengerRoom>mockMessengerRoom,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship
      });
      expect(mockViewAccepted).toHaveBeenCalledWith(150);
    });

    it('uses getSocketId correctly', async () => {
      await disconnecting({
        ...params,
        messengerRoom: <IMessengerRoom>mockMessengerRoom,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship
      });
      expect(mockGetSocketId).toHaveBeenCalledWith(48);
      expect(mockGetSocketId).toHaveBeenCalledWith(84);
    });

    it ('uses socket.broadcast.to with ShowOffline event correctly', async () => {
      await disconnecting({
        ...params,
        messengerRoom: <IMessengerRoom>mockMessengerRoom,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship
      });
      expect(params.socket.broadcast.to).toHaveBeenCalledWith("123456789");
    });

    it ('uses socket.broadcast.to.emit with ShowOffline event correctly', async () => {
      await disconnecting({
        ...params,
        messengerRoom: <IMessengerRoom>mockMessengerRoom,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship
      });
      expect(params.socket.broadcast.emit)
      .toHaveBeenCalledWith('ShowOffline', ChatUser(150, "Name", "Name123"));
    });

    it('uses remove correctly', async () => {
      await disconnecting({
        ...params,
        messengerRoom: <IMessengerRoom>mockMessengerRoom,
        messengerUser: <IMessengerUser>mockMessengerUser,
        nobscFriendship: <IFriendship>mockNobscFriendship
      });
      expect(mockRemove).toHaveBeenCalledWith(150);
    });
  });

});