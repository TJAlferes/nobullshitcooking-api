import { Socket } from 'socket.io';

import { IMessengerRoom } from '../../../../src/access/redis/MessengerRoom';
import { rejoinRoom } from '../../../../src/chat/handlers/rejoinRoom';

const mockAdd = jest.fn();
const mockAddUser = jest.fn();
const mockGetUsers = jest.fn()
  .mockResolvedValue([{username: "Jack"}, {username: "Jill"}]);

const mockMessengerRoom: Partial<IMessengerRoom> = {
  add: mockAdd,
  addUser: mockAddUser,
  getUsers: mockGetUsers
};

const rooms = new Set<string>();
rooms.add("room");
const mockBroadcast: any =
  {emit: jest.fn(), to: jest.fn((room: string) => mockBroadcast)};
const mockSocket: Partial<Socket> = {
  broadcast: <Socket>mockBroadcast,
  emit: jest.fn().mockReturnValue(true),
  join: jest.fn(),
  rooms
};

const params = {
  room: "room",
  username: "self",
  socket: <Socket>mockSocket,
  messengerRoom: <IMessengerRoom>mockMessengerRoom
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('rejoinRoom handler', () => {
  it ('uses socket.join correctly', async () => {
    await rejoinRoom(params);
    expect(params.socket.join).toHaveBeenCalledWith("room");
  });

  // ?
  it ('uses add correctly', async () => {
    await rejoinRoom(params);
    expect(mockAdd).toHaveBeenCalledWith("room");
  });

  it ('uses addUser correctly', async () => {
    await rejoinRoom(params);
    expect(mockAddUser).toHaveBeenCalledWith("self", "room");
  });

  it ('uses getUsers correctly', async () => {
    await rejoinRoom(params);
    expect(mockGetUsers).toHaveBeenCalledWith("room");
  });

  it ('uses socket.broadcast.to correctly', async () => {
    await rejoinRoom(params);
    expect(params.socket.broadcast.to).toHaveBeenCalledWith("room");
  });

  it ('uses socket.broadcast.emit correctly', async () => {
    await rejoinRoom(params);
    expect(params.socket.broadcast.emit)
      .toHaveBeenCalledWith('AddUser', "self");
  });

  it ('uses socket.emit with RegetUser event correctly', async () => {
    await rejoinRoom(params);
    expect(params.socket.emit).toHaveBeenCalledWith(
      'RegetUser', [{username: "Jack"}, {username: "Jill"}], "room"
    );
  });
});