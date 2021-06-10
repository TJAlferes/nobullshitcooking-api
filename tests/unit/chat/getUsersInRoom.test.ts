import { Socket } from 'socket.io';

import { IChatStore } from '../../../src/access/redis';
import { getUsersInRoom } from '../../../src/chat';

const mockGetUsersInRoom = jest.fn().mockResolvedValue(["Jack", "Jill"]);

const mockChatStore: Partial<IChatStore> = {getUsersInRoom: mockGetUsersInRoom};

const mockSocket: Partial<Socket> = {emit: jest.fn().mockReturnValue(true)};
const params = {
  room: "room",
  socket: <Socket>mockSocket,
  chatStore: <IChatStore>mockChatStore
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('getUsersInRoom handler', () => {
  it ('uses getUsersInRoom', async () => {
    await getUsersInRoom(params);
    expect(mockGetUsersInRoom).toHaveBeenCalledWith("room");
  });

  it ('uses socket.emit with UsersInRoom event', async () => {
    await getUsersInRoom(params);
    expect(params.socket.emit)
      .toHaveBeenCalledWith('UsersInRoom', ["Jack", "Jill"]);
  });
});