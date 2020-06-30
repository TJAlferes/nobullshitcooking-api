import { ChatMessage } from './ChatMessage';

const chat = ChatMessage(
  'hello',
  '5067',
  {userId: 7, username: 'Lucky', avatar: 'Lucky'}
);

describe('ChatMessage', () => {
  it('returns a chatMessageId as current time appended to the userId', () => {
    expect(chat.chatMessageId[0]).toEqual('7');
  });

  it('returns the chatMessageText', () => {
    expect(chat.chatMessageText).toEqual('hello');
  });

  it('returns the room', () => {
    expect(chat.room).toEqual('5067');
  });

  it('returns the user', () => {
    expect(chat.user).toEqual({userId: 7, username: 'Lucky', avatar: 'Lucky'});
  });
});