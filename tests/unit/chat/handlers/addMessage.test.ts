import { Socket } from 'socket.io';

import { IMessengerChat } from '../../../../src/redis-access/MessengerChat';
import { ChatMessage } from '../../../../src/chat/entities/ChatMessage';
import { ChatUser } from '../../../../src/chat/entities/ChatUser';
import { addMessage } from '../../../../src/chat/handlers/addMessage';

const mockAddMessage = jest.fn();
const mockMessengerChat: Partial<IMessengerChat> = {addMessage: mockAddMessage};

jest.mock('../../../../src/chat/entities/ChatMessage');
const mockChatMessage = ChatMessage as jest.Mocked<typeof ChatMessage>;

jest.mock('../../../../src/chat/entities/ChatUser');
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
  text: "howdy",
  id: 150,
  username: "Name",
  avatar: "Name123",
  socket: <Socket>mockSocket,
  messengerChat: <IMessengerChat>mockMessengerChat
};

afterEach(() => {
  jest.clearAllMocks();
});

describe ('addMessage handler', () => {
  it('uses ChatUser correctly', async () => {
    await addMessage(params);
    expect(mockChatUser).toHaveBeenCalledWith(150, "Name", "Name123");
  });

  it('uses ChatMessage correctly', async () => {
    await addMessage(params);
    expect(mockChatMessage).toHaveBeenCalledWith(
      "howdy", "someRoom", ChatUser(150, "Name", "Name123")
    );
  });

  it('uses addMessage correctly', async () => {
    await addMessage(params);
    expect(mockAddMessage).toHaveBeenCalledWith(
      ChatMessage("howdy", "someRoom", ChatUser(150, "Name", "Name123"))
    );
  });

  it('uses socket.broadcast.to correctly', async () => {
    await addMessage(params);
    expect(params.socket.broadcast.to).toHaveBeenCalledWith("someRoom");
  });

  it('uses socket.broadcast.to.emit correctly', async () => {
    await addMessage(params);
    expect(params.socket.broadcast.emit).toHaveBeenCalledWith(
      'AddMessage',
      ChatMessage("howdy", "someRoom", ChatUser(150, "Name", "Name123"))
    );
  });

  it('uses socket.emit correctly', async () => {
    await addMessage(params);
    expect(params.socket.emit).toHaveBeenCalledWith(
      'AddMessage',
      ChatMessage("howdy", "someRoom", ChatUser(150, "Name", "Name123"))
    );
  });
});