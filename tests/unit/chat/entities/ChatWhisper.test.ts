import { ChatWhisper } from '../../../../src/chat/entities/ChatWhisper';

const whisper =
  ChatWhisper('hello', 'Batman', {id: 7, username: 'Lucky', avatar: 'Lucky'});

describe('Whisper', () => {
  it('returns a id as current time appended to the id', () => {
    expect(whisper.id[0]).toEqual('7');
  });

  it('returns the text', () => {
    expect(whisper.text).toEqual('hello');
  });

  it('returns the to', () => {
    expect(whisper.to).toEqual('Batman');
  });

  it('returns the user', () => {
    expect(whisper.user).toEqual({id: 7, username: 'Lucky', avatar: 'Lucky'});
  });
});