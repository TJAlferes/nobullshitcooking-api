import { Socket } from 'socket.io';

import { IChatStore } from '../../../src/access/redis';
import { rejoinRoom } from '../../../src/chat';

const mockCreateRoom = jest.fn();
const mockAddUserToRoom = jest.fn();
const mockGetUsersInRoom = jest.fn().mockResolvedValue(["Jack", "Jill"]);

const mockChatStore: Partial<IChatStore> = {createRoom: mockCreateRoom, addUserToRoom: mockAddUserToRoom, getUsersInRoom: mockGetUsersInRoom};

const rooms = new Set<string>();
rooms.add("room");
const mockBroadcast: any = {emit: jest.fn(), to: jest.fn((room: string) => mockBroadcast)};
const mockSocket: Partial<Socket> = {broadcast: <Socket>mockBroadcast, emit: jest.fn().mockReturnValue(true), join: jest.fn(), rooms};

const params = {room: "room", username: "self", socket: <Socket>mockSocket, chatStore: <IChatStore>mockChatStore};

afterEach(() => {
  jest.clearAllMocks();
});

describe('rejoinRoom handler', () => {
  it ('uses socket.join', async () => {
    await rejoinRoom(params);
    expect(params.socket.join).toHaveBeenCalledWith("room");
  });

  // ?
  it ('uses createRoom', async () => {
    await rejoinRoom(params);
    expect(mockCreateRoom).toHaveBeenCalledWith("room");
  });

  it ('uses addUserToRoom', async () => {
    await rejoinRoom(params);
    expect(mockAddUserToRoom).toHaveBeenCalledWith("self", "room");
  });

  it ('uses getUsersInRoom', async () => {
    await rejoinRoom(params);
    expect(mockGetUsersInRoom).toHaveBeenCalledWith("room");
  });

  it ('uses socket.broadcast.to', async () => {
    await rejoinRoom(params);
    expect(params.socket.broadcast.to).toHaveBeenCalledWith("room");
  });

  it ('uses socket.broadcast.emit', async () => {
    await rejoinRoom(params);
    expect(params.socket.broadcast.emit).toHaveBeenCalledWith('UserJoinedRoom', "self");
  });

  it ('uses socket.emit with RegetUser event', async () => {
    await rejoinRoom(params);
    expect(params.socket.emit).toHaveBeenCalledWith('UsersInRoomRefetched', ["Jack", "Jill"], "room");
  });
});