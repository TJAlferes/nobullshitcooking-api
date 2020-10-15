import { Socket } from 'socket.io';

import { IMessengerRoom } from '../../../../src/access/redis/MessengerRoom';
import { ChatUser } from '../../../../src/chat/entities/ChatUser';
import { addRoom } from '../../../../src/chat/handlers/addRoom';

const mockAdd = jest.fn();
const mockAddUser = jest.fn();
const mockGetUsers = jest.fn().mockResolvedValue([]);
const mockRemoveUser = jest.fn();
const mockMessengerRoom: Partial<IMessengerRoom> = {
  add: mockAdd,
  addUser: mockAddUser,
  getUsers: mockGetUsers,
  removeUser: mockRemoveUser,
};

jest.mock('../../../../src/chat/entities/ChatUser');
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

  it('uses removeUser correctly', async () => {
    await addRoom(params);
    expect(mockRemoveUser).toHaveBeenCalledWith(150, "someRoom");
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
    expect(mockAdd).toHaveBeenCalledWith("nextRoom");
  });

  it('uses addUser correctly', async () => {
    await addRoom(params);
    expect(mockAddUser).toHaveBeenCalledWith(150, "nextRoom");
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

  it('uses getUsers correctly', async () => {
    await addRoom(params);
    expect(mockGetUsers).toHaveBeenCalledWith("nextRoom");
  });

  it('uses socket.emit with GetUser event correctly', async () => {
    await addRoom(params);
    expect(params.socket.emit)
      .toHaveBeenCalledWith('GetUser', [], "nextRoom");
  });
});