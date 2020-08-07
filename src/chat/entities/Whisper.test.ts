import { Whisper } from './Whisper';

const whisper = Whisper(
  'hello',
  'Batman',
  {id: 7, username: 'Lucky', avatar: 'Lucky'}
);

describe('Whisper', () => {
  it('returns a whisperId as current time appended to the id', () => {
    expect(whisper.whisperId[0]).toEqual('7');
  });

  it('returns the whisperText', () => {
    expect(whisper.whisperText).toEqual('hello');
  });

  it('returns the to', () => {
    expect(whisper.to).toEqual('Batman');
  });

  it('returns the user', () => {
    expect(whisper.user)
    .toEqual({id: 7, username: 'Lucky', avatar: 'Lucky'});
  });
});