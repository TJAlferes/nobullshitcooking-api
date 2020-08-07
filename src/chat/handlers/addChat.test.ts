import { Socket } from 'socket.io';

import { IMessengerChat } from '../../redis-access/MessengerChat';
import { ChatMessage } from '../entities/ChatMessage';
import { ChatUser } from '../entities/ChatUser';
import { addChat } from './addChat';

const mockAddChat = jest.fn();
const mockMessengerChat: Partial<IMessengerChat> = {addChat: mockAddChat};

jest.mock('../entities/ChatMessage');
const mockChatMessage = ChatMessage as jest.Mocked<typeof ChatMessage>;

jest.mock('../entities/ChatUser');
const mockChatUser = ChatUser as jest.Mocked<typeof ChatUser>;

// big thanks to Guilherme De Jesus Rafael
// https://stackoverflow.com/questions/56644690/how-to-mock-chained-function-calls-using-jest
const mockBroadcast: any = {
  emit: jest.fn(),
  to: jest.fn((room: string) => mockBroadcast)
};

const mockSocket: Partial<Socket> = {
  broadcast: <Socket>mockBroadcast,
  emit: jest.fn(),
  rooms: {"someRoom": "someRoom"}
};

const params = {
  chatMessageText: "howdy",
  id: 150,
  username: "Name",
  avatar: "Name123",
  socket: <Socket>mockSocket,
  messengerChat: <IMessengerChat>mockMessengerChat
};

afterEach(() => {
  jest.clearAllMocks();
});

describe ('addChat handler', () => {
  it('uses ChatUser correctly', async () => {
    await addChat(params);
    expect(mockChatUser).toHaveBeenCalledWith(150, "Name", "Name123");
  });

  it('uses ChatMessage correctly', async () => {
    await addChat(params);
    expect(mockChatMessage).toHaveBeenCalledWith(
      "howdy", "someRoom", ChatUser(150, "Name", "Name123")
    );
  });

  it('uses addChat correctly', async () => {
    await addChat(params);
    expect(mockAddChat).toHaveBeenCalledWith(
      ChatMessage("howdy", "someRoom", ChatUser(150, "Name", "Name123"))
    );
  });

  it('uses socket.broadcast.to correctly', async () => {
    await addChat(params);
    expect(params.socket.broadcast.to).toHaveBeenCalledWith("someRoom");
  });

  it('uses socket.broadcast.to.emit correctly', async () => {
    await addChat(params);
    expect(params.socket.broadcast.emit).toHaveBeenCalledWith(
      'AddChat',
      ChatMessage("howdy", "someRoom", ChatUser(150, "Name", "Name123"))
    );
  });

  it('uses socket.emit correctly', async () => {
    await addChat(params);
    expect(params.socket.emit).toHaveBeenCalledWith(
      'AddChat',
      ChatMessage("howdy", "someRoom", ChatUser(150, "Name", "Name123"))
    );
  });
});