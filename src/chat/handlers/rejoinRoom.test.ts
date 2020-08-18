import { Socket } from 'socket.io';

import { IMessengerRoom } from '../../redis-access/MessengerRoom';
import { ChatUser } from '../entities/ChatUser';
import { rejoinRoom } from './rejoinRoom';

const mockAdd = jest.fn();
const mockAddUser = jest.fn();
const mockGetUsers = jest.fn().mockResolvedValue([
  {id: 48, username: "Jack", avatar: "Jack123"},
  {id: 84, username: "Jill", avatar: "Jill123"}
]);
const mockMessengerRoom: Partial<IMessengerRoom> = {
  add: mockAdd,
  addUser: mockAddUser,
  getUsers: mockGetUsers
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
  id: 150,
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
    expect(params.socket.join).toHaveBeenCalledWith("someRoom");
  });

  // ?
  it ('uses add correctly', async () => {
    await rejoinRoom(params);
    expect(mockAdd).toHaveBeenCalledWith("someRoom");
  });

  it ('uses addUser correctly', async () => {
    await rejoinRoom(params);
    expect(mockAddUser).toHaveBeenCalledWith(150, "someRoom");
  });

  it ('uses getUsers correctly', async () => {
    await rejoinRoom(params);
    expect(mockGetUsers).toHaveBeenCalledWith("someRoom");
  });

  it ('uses socket.broadcast.to correctly', async () => {
    await rejoinRoom(params);
    expect(params.socket.broadcast.to).toHaveBeenCalledWith("someRoom");
  });

  it ('uses socket.broadcast.emit correctly', async () => {
    await rejoinRoom(params);
    expect(params.socket.broadcast.emit)
      .toHaveBeenCalledWith('AddUser', ChatUser(150, "Name", "Name123"));
  });

  it ('uses socket.emit with RegetUser event correctly', async () => {
    await rejoinRoom(params);
    expect(params.socket.emit).toHaveBeenCalledWith(
      'RegetUser',
      [
        {id: 48, username: "Jack", avatar: "Jack123"},
        {id: 84, username: "Jill", avatar: "Jill123"}
      ],
      "someRoom"
    );
  });
});