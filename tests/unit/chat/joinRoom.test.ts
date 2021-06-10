import { Socket } from 'socket.io';

import { IChatRoom } from '../../../../src/access/redis/ChatRoom';
import { addRoom } from '../../../../src/chat/handlers/addRoom';

const mockAdd = jest.fn();
const mockAddUser = jest.fn();
const mockGetUsers = jest.fn().mockResolvedValue([]);
const mockRemoveUser = jest.fn();
const mockChatRoom: Partial<IChatRoom> = {
  add: mockAdd,
  addUser: mockAddUser,
  getUsers: mockGetUsers,
  removeUser: mockRemoveUser,
};

const mockBroadcast: any = {
  emit: jest.fn(),
  to: jest.fn((room: string) => mockBroadcast)
};

const rooms = new Set<string>();
rooms.add("room");
const mockSocket: Partial<Socket> = {
  broadcast: <Socket>mockBroadcast,
  emit: jest.fn(),
  join: jest.fn(),
  leave: jest.fn(),
  rooms
};

const params = {
  room: "nextRoom",
  username: "self",
  socket: <Socket>mockSocket,
  chatRoom: <IChatRoom>mockChatRoom
};

afterEach(() => {
  jest.clearAllMocks();
});

describe ('addRoom handler', () => {
  it('uses socket.leave correctly', async () => {
    await addRoom(params);
    expect(params.socket.leave).toHaveBeenCalledWith("room");
  });

  it('uses removeUser correctly', async () => {
    await addRoom(params);
    expect(mockRemoveUser).toHaveBeenCalledWith("self", "room");
  });

  it('uses socket.broadcast.to with Remove user event correctly', async () => {
    await addRoom(params);
    expect(params.socket.broadcast.to).toHaveBeenCalledWith("room");
  });

  it(
    'uses socket.broadcast.to.emit with RemoveUser event correctly',
    async () => {
      await addRoom(params);
      expect(params.socket.broadcast.emit)
        .toHaveBeenCalledWith('RemoveUser', "self");
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
    expect(mockAddUser).toHaveBeenCalledWith("self", "nextRoom");
  });

  it('uses socket.broadcast.to with AddUser event correctly', async () => {
    await addRoom(params);
    expect(params.socket.broadcast.to).toHaveBeenCalledWith("nextRoom");
  });

  it('uses socket.broadcast.to.emit with AddUser event correctly', async () => {
    await addRoom(params);
    expect(params.socket.broadcast.emit)
      .toHaveBeenCalledWith('AddUser', "self");
  });

  it('uses getUsers correctly', async () => {
    await addRoom(params);
    expect(mockGetUsers).toHaveBeenCalledWith("nextRoom");
  });

  it('uses socket.emit with GetUser event correctly', async () => {
    await addRoom(params);
    expect(params.socket.emit).toHaveBeenCalledWith('GetUser', [], "nextRoom");
  });
});