import { Socket } from 'socket.io';

import { IMessengerRoom } from '../../redis-access/MessengerRoom';
import { ChatUser } from '../entities/ChatUser';
import { addRoom } from './addRoom';

const mockAddRoom = jest.fn();
const mockAddUserToRoom = jest.fn();
const mockGetUsersInRoom = jest.fn().mockResolvedValue([]);
const mockRemoveUserFromRoom = jest.fn();
const mockMessengerRoom: Partial<IMessengerRoom> = {
  addRoom: mockAddRoom,
  addUserToRoom: mockAddUserToRoom,
  getUsersInRoom: mockGetUsersInRoom,
  removeUserFromRoom: mockRemoveUserFromRoom,
};

jest.mock('../entities/ChatUser');
const mockChatUser = ChatUser as jest.Mocked<typeof ChatUser>;

const mockBroadcast: any = {
  emit: jest.fn(),
  to: jest.fn((room: string) => mockBroadcast)
};

const mockSocket: Partial<Socket> = {
  broadcast: <Socket>mockBroadcast,
  emit: jest.fn(),
  join: jest.fn(),
  leave: jest.fn(),
  rooms: {"someRoom": "someRoom"}
};

const params = {
  room: "nextRoom",
  id: 150,
  username: "Name",
  avatar: "Name123",
  socket: <Socket>mockSocket,
  messengerRoom: <IMessengerRoom>mockMessengerRoom
};

afterEach(() => {
  jest.clearAllMocks();
});

describe ('addRoom handler', () => {
  it('uses ChatUser correctly', async () => {
    await addRoom(params);
    expect(mockChatUser).toHaveBeenCalledWith(150, "Name", "Name123");
    expect(mockChatUser).toHaveBeenCalledTimes(2);
  });

  it('uses socket.leave correctly', async () => {
    await addRoom(params);
    expect(params.socket.leave).toHaveBeenCalledWith("someRoom");
  });

  it('uses removeUserFromRoom correctly', async () => {
    await addRoom(params);
    expect(mockRemoveUserFromRoom).toHaveBeenCalledWith(150, "someRoom");
  });

  it('uses socket.broadcast.to with Remove user event correctly', async () => {
    await addRoom(params);
    expect(params.socket.broadcast.to).toHaveBeenCalledWith("someRoom");
  });

  it(
    'uses socket.broadcast.to.emit with Remove user event correctly',
    async () => {
      await addRoom(params);
      expect(params.socket.broadcast.emit)
        .toHaveBeenCalledWith('RemoveUser', ChatUser(150, "Name", "Name123"));
    }
  );

  it('uses socket.join correctly', async () => {
    await addRoom(params);
    expect(params.socket.join).toHaveBeenCalledWith("nextRoom");
  });

  it('uses addRoom correctly', async () => {
    await addRoom(params);
    expect(mockAddRoom).toHaveBeenCalledWith("nextRoom");
  });

  it('uses addUserToRoom correctly', async () => {
    await addRoom(params);
    expect(mockAddUserToRoom).toHaveBeenCalledWith(150, "nextRoom");
  });

  it('uses socket.broadcast.to with AddUser event correctly', async () => {
    await addRoom(params);
    expect(params.socket.broadcast.to).toHaveBeenCalledWith("nextRoom");
  });

  it('uses socket.broadcast.to.emit with AddUser event correctly', async () => {
    await addRoom(params);
    expect(params.socket.broadcast.emit)
      .toHaveBeenCalledWith('AddUser', ChatUser(150, "Name", "Name123"));
  });

  it('uses getUsersInRoom correctly', async () => {
    await addRoom(params);
    expect(mockGetUsersInRoom).toHaveBeenCalledWith("nextRoom");
  });

  it('uses socket.emit with GetUser event correctly', async () => {
    await addRoom(params);
    expect(params.socket.emit)
      .toHaveBeenCalledWith('GetUser', [], "nextRoom");
  });
});