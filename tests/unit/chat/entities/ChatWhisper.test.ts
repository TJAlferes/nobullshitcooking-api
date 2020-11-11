import { ChatWhisper } from '../../../../src/chat/entities/ChatWhisper';

const whisper =
  ChatWhisper('hello', 'Batman', {username: 'Lucky', avatar: 'Lucky'});

describe('Whisper', () => {
  it('returns a id as current time appended to the username', () => {
    expect(whisper.id[0]).toEqual('L');
  });

  it('returns the text', () => {
    expect(whisper.text).toEqual('hello');
  });

  it('returns the to', () => {
    expect(whisper.to).toEqual('Batman');
  });

  it('returns the user', () => {
    expect(whisper.user).toEqual({username: 'Lucky', avatar: 'Lucky'});
  });
});