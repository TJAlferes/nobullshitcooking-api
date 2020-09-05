import { ChatMessage } from '../../../../src/chat/entities/ChatMessage';

const message =
  ChatMessage('hello', '5067', {id: 7, username: 'Lucky', avatar: 'Lucky'});

describe('ChatMessage', () => {
  it('returns a id as current time appended to the id', () => {
    expect(message.id[0]).toEqual('7');
  });

  it('returns the text', () => {
    expect(message.text).toEqual('hello');
  });

  it('returns the room', () => {
    expect(message.room).toEqual('5067');
  });

  it('returns the user', () => {
    expect(message.user).toEqual({id: 7, username: 'Lucky', avatar: 'Lucky'});
  });
});