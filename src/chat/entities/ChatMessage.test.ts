const ChatMessage = require('./ChatMessage');

const chat = ChatMessage('hello', '5067', {
  userId: 7,
  username: 'Lucky',
  avatar: 'Lucky'
});

describe('ChatMessage', () => {
  it('should have three parameters', () => {
    const actual = ChatMessage.length;
    const expected = 3;
    expect(actual).toEqual(expected);
  });
  it('should return a chatMessageId as the current time appended to the userId', () => {
    const actual = chat.chatMessageId[0];
    const expected = '7';
    expect(actual).toEqual(expected);
  });
  it('should simply return the chatMessageText', () => {
    const actual = chat.chatMessageText;
    const expected = 'hello';
    expect(actual).toEqual(expected);
  });
  it('should simply return the room', () => {
    const actual = chat.room;
    const expected = '5067';
    expect(actual).toEqual(expected);
  });
  it('should simply return the user', () => {
    const actual = chat.user;
    const expected = {
      userId: 7,
      username: 'Lucky',
      avatar: 'Lucky'
    };
    expect(actual).toEqual(expected);
  });
});