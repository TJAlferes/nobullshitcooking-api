import { Socket } from 'socket.io';

import { IChatStore } from '../../../src/access/redis';
import { PublicMessage, sendMessage } from '../../../src/chat';

const mockCreateMessage = jest.fn();
const mockChatStore: Partial<IChatStore> = {createMessage: mockCreateMessage};

//jest.mock('../../../../src/chat/entities/PublicMessage');  // TO DO: change
const mockPublicMessage = PublicMessage as jest.Mocked<typeof PublicMessage>;

// big thanks to Guilherme De Jesus Rafael
// https://stackoverflow.com/questions/56644690/how-to-mock-chained-function-calls-using-jest
const mockBroadcast: any = {emit: jest.fn(), to: jest.fn((room: string) => mockBroadcast)};

const rooms = new Set<string>();
rooms.add("someRoom");
const mockSocket: Partial<Socket> = {broadcast: <Socket>mockBroadcast, emit: jest.fn(), rooms};

const params = {from: "self", text: "hello", socket: <Socket>mockSocket, messengerChat: <IChatStore>mockChatStore};

afterEach(() => {
  jest.clearAllMocks();
});

describe ('sendMessage handler', () => {
  it('uses PublicMessage', async () => {
    await sendMessage(params);
    expect(mockPublicMessage).toHaveBeenCalledWith("room", "self", "hello");
  });

  it('uses createMessage', async () => {
    await sendMessage(params);
    expect(mockCreateMessage).toHaveBeenCalledWith(PublicMessage("room", "self", "hello"));
  });

  it('uses socket.broadcast.to', async () => {
    await sendMessage(params);
    expect(params.socket.broadcast.to).toHaveBeenCalledWith("room");
  });

  it('uses socket.broadcast.to.emit', async () => {
    await sendMessage(params);
    //params.socket.broadcast.to.emit ???
    expect(params.socket.broadcast.emit).toHaveBeenCalledWith('Message', PublicMessage("room", "self", "hello"));
  });

  it('uses socket.emit with Message event', async () => {
    await sendMessage(params);
    expect(params.socket.emit).toHaveBeenCalledWith('Message', PublicMessage("room", "self", "hello"));
  });
});