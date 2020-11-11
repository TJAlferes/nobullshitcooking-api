import { Socket } from 'socket.io';

import { IMessengerRoom } from '../../../../src/access/redis/MessengerRoom';
import { getUser } from '../../../../src/chat/handlers/getUser';

const mockGetUsers = jest.fn().mockResolvedValue([
  {username: "Jack", avatar: "Jack123"},
  {username: "Jill", avatar: "Jill123"}
]);
const mockMessengerRoom: Partial<IMessengerRoom> = {getUsers: mockGetUsers};

const mockSocket: Partial<Socket> = {emit: jest.fn().mockReturnValue(true)};
const params = {
  room: "someRoom",
  socket: <Socket>mockSocket,
  messengerRoom: <IMessengerRoom>mockMessengerRoom
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('getUser handler', () => {
  it ('uses getUsersInRoom correctly', async () => {
    await getUser(params);
    expect (mockGetUsers).toHaveBeenCalledWith("someRoom");
  });

  it ('uses socket.emit with GetUser event correctly', async () => {
    await getUser(params);
    expect (params.socket.emit).toHaveBeenCalledWith('GetUser', [
      {username: "Jack", avatar: "Jack123"},
      {username: "Jill", avatar: "Jill123"}
    ]);
  });
});