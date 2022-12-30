import { Socket } from 'socket.io';

import { IChatStore } from '../../../src/access/redis';
import { joinRoom } from '../../../src/chat';

const mockCreateRoom =         jest.fn();
const mockAddUserToRoom =      jest.fn();
const mockGetUsersInRoom =     jest.fn().mockResolvedValue([]);
const mockRemoveUserFromRoom = jest.fn();
const mockChatStore: Partial<IChatStore> =
  {createRoom: mockCreateRoom, addUserToRoom: mockAddUserToRoom, getUsersInRoom: mockGetUsersInRoom, removeUserFromRoom: mockRemoveUserFromRoom};

const mockBroadcast: any = {emit: jest.fn(), to: jest.fn((room: string) => mockBroadcast)};

const rooms = new Set<string>();
rooms.add("room");
const mockSocket: Partial<Socket> = {broadcast: <Socket>mockBroadcast, emit: jest.fn(), join: jest.fn(), leave: jest.fn(), rooms};

const params = {room: "nextRoom", username: "self", socket: <Socket>mockSocket, chatStore: <IChatStore>mockChatStore};

afterEach(() => {
  jest.clearAllMocks();
});

describe ('addRoom handler', () => {
  it('uses socket.leave', async () => {
    await joinRoom(params);
    expect(params.socket.leave).toHaveBeenCalledWith("room");
  });

  it('uses removeUserFromRoom', async () => {
    await joinRoom(params);
    expect(mockRemoveUserFromRoom).toHaveBeenCalledWith("self", "room");
  });

  it('uses socket.broadcast.to with UserLeftRoom user event', async () => {
    await joinRoom(params);
    expect(params.socket.broadcast.to).toHaveBeenCalledWith("room");
  });

  it('uses socket.broadcast.to.emit with UserLeftRoom event', async () => {
      await joinRoom(params);
      expect(params.socket.broadcast.emit).toHaveBeenCalledWith('UserLeftRoom', "self");
    }
  );

  it('uses socket.join', async () => {
    await joinRoom(params);
    expect(params.socket.join).toHaveBeenCalledWith("nextRoom");
  });

  it('uses createRoom', async () => {
    await joinRoom(params);
    expect(mockCreateRoom).toHaveBeenCalledWith("nextRoom");
  });

  it('uses addUserToRoom', async () => {
    await joinRoom(params);
    expect(mockAddUserToRoom).toHaveBeenCalledWith("self", "nextRoom");
  });

  it('uses socket.broadcast.to with UserJoinedRoom event', async () => {
    await joinRoom(params);
    expect(params.socket.broadcast.to).toHaveBeenCalledWith("nextRoom");
  });

  it('uses socket.broadcast.to.emit with UserJoinedRoom event', async () => {
    await joinRoom(params);
    expect(params.socket.broadcast.emit).toHaveBeenCalledWith('UserJoinedRoom', "self");
  });

  it('uses getUsersInRoom', async () => {
    await joinRoom(params);
    expect(mockGetUsersInRoom).toHaveBeenCalledWith("nextRoom");
  });

  it('uses socket.emit with UsersInRoom event', async () => {
    await joinRoom(params);
    expect(params.socket.emit).toHaveBeenCalledWith('UsersInRoom', [], "nextRoom");
  });
});