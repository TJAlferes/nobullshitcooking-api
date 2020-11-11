import { Socket } from 'socket.io';

import { IMessengerRoom } from '../../../../src/access/redis/MessengerRoom';
import { ChatUser } from '../../../../src/chat/entities/ChatUser';
import { rejoinRoom } from '../../../../src/chat/handlers/rejoinRoom';

const mockAdd = jest.fn();
const mockAddUser = jest.fn();
const mockGetUsers = jest.fn().mockResolvedValue([
  {username: "Jack", avatar: "Jack123"},
  {username: "Jill", avatar: "Jill123"}
]);
const mockMessengerRoom: Partial<IMessengerRoom> = {
  add: mockAdd,
  addUser: mockAddUser,
  getUsers: mockGetUsers
};

const rooms = new Set<string>();
rooms.add("someRoom");
const mockBroadcast: any =
  {emit: jest.fn(), to: jest.fn((room: string) => mockBroadcast)};
const mockSocket: Partial<Socket> = {
  broadcast: <Socket>mockBroadcast,
  emit: jest.fn().mockReturnValue(true),
  join: jest.fn(),
  rooms
};

const params = {
  room: "someRoom",
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
    expect(mockAddUser).toHaveBeenCalledWith("Name", "someRoom");
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
      .toHaveBeenCalledWith('AddUser', ChatUser("Name", "Name123"));
  });

  it ('uses socket.emit with RegetUser event correctly', async () => {
    await rejoinRoom(params);
    expect(params.socket.emit).toHaveBeenCalledWith(
      'RegetUser',
      [
        {username: "Jack", avatar: "Jack123"},
        {username: "Jill", avatar: "Jill123"}
      ],
      "someRoom"
    );
  });
});