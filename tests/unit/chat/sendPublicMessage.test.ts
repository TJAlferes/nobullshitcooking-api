import { Socket } from 'socket.io';

import { IChatMessage } from '../../../../src/access/redis/ChatMessage';
import { PublicMessage } from '../../../../src/chat/entities/PublicMessage';
import {
  addPublicMessage
} from '../../../../src/chat/handlers/addPublicMessage';

const mockAddPublicMessage = jest.fn();
const mockChatMessage: Partial<IChatMessage> =
  {addMessage: mockAddPublicMessage};

jest.mock('../../../../src/chat/entities/PublicMessage');
const mockPublicMessage = PublicMessage as jest.Mocked<typeof PublicMessage>;

// big thanks to Guilherme De Jesus Rafael
// https://stackoverflow.com/questions/56644690/how-to-mock-chained-function-calls-using-jest
const mockBroadcast: any = {
  emit: jest.fn(),
  to: jest.fn((room: string) => mockBroadcast)
};

const rooms = new Set<string>();
rooms.add("someRoom");
const mockSocket: Partial<Socket> = {
  broadcast: <Socket>mockBroadcast,
  emit: jest.fn(),
  rooms
};

const params = {
  from: "self",
  text: "hello",
  socket: <Socket>mockSocket,
  messengerChat: <IChatMessage>mockChatMessage
};

afterEach(() => {
  jest.clearAllMocks();
});

describe ('addPublicMessage handler', () => {
  it('uses PublicMessage correctly', async () => {
    await addPublicMessage(params);
    expect(mockPublicMessage).toHaveBeenCalledWith("room", "self", "hello");
  });

  it('uses addMessage correctly', async () => {
    await addPublicMessage(params);
    expect(mockAddPublicMessage)
      .toHaveBeenCalledWith(PublicMessage("room", "self", "hello"));
  });

  it('uses socket.broadcast.to correctly', async () => {
    await addPublicMessage(params);
    expect(params.socket.broadcast.to).toHaveBeenCalledWith("room");
  });

  it('uses socket.broadcast.to.emit correctly', async () => {
    await addPublicMessage(params);
    expect(params.socket.broadcast.emit).toHaveBeenCalledWith(
      'AddPublicMessage', PublicMessage("room", "self", "hello")
    );
  });

  it('uses socket.emit with AddPublicMessage event correctly', async () => {
    await addPublicMessage(params);
    expect(params.socket.emit).toHaveBeenCalledWith(
      'AddPublicMessage', PublicMessage("room", "self", "hello")
    );
  });
});