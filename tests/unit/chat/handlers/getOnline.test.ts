import { Socket } from 'socket.io';

import { IFriendship } from '../../../../src/access/mysql/Friendship';
import { IMessengerUser } from '../../../../src/access/redis/MessengerUser';
import { IGetOnline, getOnline } from '../../../../src/chat/handlers/getOnline';

const mockViewAccepted = jest.fn()
  .mockResolvedValue([{username: "Jack"}, {username: "Jill"}]);

const mockNobscFriendship: Partial<IFriendship> =
  {viewAccepted: mockViewAccepted};

const rooms = new Set<string>();
rooms.add("room");

const mockBroadcast: any =
  {emit: jest.fn(), to: jest.fn((room: string) => mockBroadcast)};

const mockSocket: Partial<Socket> = {
  broadcast: <Socket>mockBroadcast,
  emit: jest.fn().mockReturnValue(true),
  rooms
};

let mockGetSocketId = jest.fn();
let mockMessengerUser: Partial<IMessengerUser>;

const params = {
  username: "self",
  socket: <Socket>mockSocket,
  nobscFriendship: <IFriendship>mockNobscFriendship
};

let currParams: IGetOnline;

afterEach(() => {
  jest.clearAllMocks();
});

describe('getOnline handler', () => {

  describe('when friends are offline', () => {
    beforeAll(() => {
      mockGetSocketId = jest.fn().mockResolvedValue(undefined);
      mockMessengerUser = {getSocketId: mockGetSocketId};
      currParams = {
        ...params,
        messengerUser: <IMessengerUser>mockMessengerUser
      };
    });

    it ('uses viewMyAcceptedFriendships correctly', async () => {
      await getOnline(currParams);
      expect(mockViewAccepted).toHaveBeenCalledWith(150);
    });

    it ('uses getSocketId correctly', async () => {
      await getOnline(currParams);
      expect(mockGetSocketId).toHaveBeenCalledWith("Jack");
      expect(mockGetSocketId).toHaveBeenCalledWith("Jill");
    });

    it ('uses socket.emit with GetOnline event correctly', async () => {
      await getOnline(currParams);
      // finish
    });
  });

  describe('when friends are online', () => {
    beforeAll(() => {
      mockGetSocketId = jest.fn().mockResolvedValue("123456789");
      mockMessengerUser = {getSocketId: mockGetSocketId};
      currParams = {
        ...params,
        messengerUser: <IMessengerUser>mockMessengerUser
      };
    });

    it ('uses viewMyAcceptedFriendships correctly', async () => {
      await getOnline(currParams);
      expect(mockViewAccepted).toHaveBeenCalledWith(150);
    });

    it ('uses getSocketId correctly', async () => {
      await getOnline(currParams);
      expect(mockGetSocketId).toHaveBeenCalledWith("Jack");
      expect(mockGetSocketId).toHaveBeenCalledWith("Jill");
    });

    it ('uses socket.broadcast.to with ShowOnline event correctly', async () => {
        await getOnline(currParams);
        expect(params.socket.broadcast.to).toHaveBeenCalledWith("123456789");
      }
    );

    it ('uses socket.broadcast.emit with ShowOnline event correctly', async () => {
        await getOnline(currParams);
        expect(params.socket.broadcast.emit)
          .toHaveBeenCalledWith('ShowOnline', "self");
      }
    );

    it ('uses socket.emit with GetOnline event correctly', async () => {
      await getOnline(currParams);
      expect(params.socket.emit).toHaveBeenCalledWith(
        'GetOnline',
        [{username: "Jack"}, {username: "Jill"}]
      );
    });
  });

});