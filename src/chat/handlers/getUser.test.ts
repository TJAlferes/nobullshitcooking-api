import { Socket } from 'socket.io';

import { IMessengerRoom } from '../../redis-access/MessengerRoom';
import { getUser } from './getUser';

const mockGetUsersInRoom = jest.fn().mockResolvedValue([
  {user_id: 48, username: "Jack", avatar: "Jack123"},
  {user_id: 84, username: "Jill", avatar: "Jill123"}
]);
const mockMessengerRoom: Partial<IMessengerRoom> = {
  getUsersInRoom: mockGetUsersInRoom
};

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
    expect (mockGetUsersInRoom).toHaveBeenCalledWith("someRoom");
  });

  it ('uses socket.emit with GetUser event correctly', async () => {
    await getUser(params);
    expect (params.socket.emit).toHaveBeenCalledWith('GetUser', [
      {user_id: 48, username: "Jack", avatar: "Jack123"},
      {user_id: 84, username: "Jill", avatar: "Jill123"}
    ]);
  });
});