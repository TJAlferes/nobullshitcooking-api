import { Socket } from 'socket.io';

import { IMessengerRoom } from '../../redis-access/MessengerRoom';
import { ChatUser } from '../entities/ChatUser';
import { rejoinRoom } from './rejoinRoom';

const mockAddRoom = jest.fn();
const mockAddUserToRoom = jest.fn();
const mockGetUsersInRoom = jest.fn().mockResolvedValue([
  {user_id: 48, username: "Jack", avatar: "Jack123"},
  {user_id: 84, username: "Jill", avatar: "Jill123"}
]);
const mockMessengerRoom: Partial<IMessengerRoom> = {
  addRoom: mockAddRoom,
  addUserToRoom: mockAddUserToRoom,
  getUsersInRoom: mockGetUsersInRoom
};

const mockBroadcast: any = {
  emit: jest.fn(),
  to: jest.fn((room: string) => mockBroadcast)
};

const mockSocket: Partial<Socket> = {
  broadcast: <Socket>mockBroadcast,
  emit: jest.fn().mockReturnValue(true),
  join: jest.fn(),
  rooms: {"someRoom": "someRoom"}
};

const params = {
  room: "someRoom",
  userId: 150,
  username: "Name",
  avatar: "Name123",
  socket: <Socket>mockSocket,
  messengerRoom: <IMessengerRoom>mockMessengerRoom
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('rejoinRoom handler', () => {
  it ('uses socket.join correctly', async () => {
    await rejoinRoom(params);
    expect (params.socket.join).toHaveBeenCalledWith("someRoom");
  });

  // ?
  it ('uses addRoom correctly', async () => {
    await rejoinRoom(params);
    expect (mockAddRoom).toHaveBeenCalledWith("someRoom");
  });

  it ('uses addUserToRoom correctly', async () => {
    await rejoinRoom(params);
    expect (mockAddUserToRoom).toHaveBeenCalledWith(150, "someRoom");
  });

  it ('uses getUsersInRoom correctly', async () => {
    await rejoinRoom(params);
    expect (mockGetUsersInRoom).toHaveBeenCalledWith("someRoom");
  });

  it ('uses socket.broadcast.to correctly', async () => {
    await rejoinRoom(params);
    expect (params.socket.broadcast.to).toHaveBeenCalledWith("someRoom");
  });

  it ('uses socket.broadcast.emit correctly', async () => {
    await rejoinRoom(params);
    expect (params.socket.broadcast.emit)
    .toHaveBeenCalledWith('AddUser', ChatUser(150, "Name", "Name123"));
  });

  it ('uses socket.emit with RegetUser event correctly', async () => {
    await rejoinRoom(params);
    expect (params.socket.emit).toHaveBeenCalledWith(
      'RegetUser',
      [
        {user_id: 48, username: "Jack", avatar: "Jack123"},
        {user_id: 84, username: "Jill", avatar: "Jill123"}
      ],
      "someRoom"
    );
  });
});