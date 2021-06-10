import { Socket } from 'socket.io';

import { IChatRoom } from '../../../../src/access/redis/ChatRoom';
import { getUser } from '../../../../src/chat/handlers/getUser';

const mockGetUsers = jest.fn()
  .mockResolvedValue([{username: "Jack"}, {username: "Jill"}]);

const mockChatRoom: Partial<IChatRoom> = {getUsers: mockGetUsers};

const mockSocket: Partial<Socket> = {emit: jest.fn().mockReturnValue(true)};
const params = {
  room: "room",
  socket: <Socket>mockSocket,
  chatRoom: <IChatRoom>mockChatRoom
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('getUser handler', () => {
  it ('uses getUsersInRoom correctly', async () => {
    await getUser(params);
    expect (mockGetUsers).toHaveBeenCalledWith("room");
  });

  it ('uses socket.emit with GetUser event correctly', async () => {
    await getUser(params);
    expect (params.socket.emit).toHaveBeenCalledWith(
      'GetUser',
      [{username: "Jack"}, {username: "Jill"}]
    );
  });
});