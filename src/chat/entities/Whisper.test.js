const Whisper = require('./Whisper');

const whisper = Whisper('hello', 'Batman', {
  userId: 7,
  username: 'Lucky',
  avatar: 'Lucky'
});

describe('Whisper', () => {
  it('should have three parameters', () => {
    const actual = Whisper.length;
    const expected = 3;
    expect(actual).toEqual(expected);
  });
  it('should return a whisperId as the current time appended to the userId', () => {
    const actual = whisper.whisperId[0];
    const expected = '7';
    expect(actual).toEqual(expected);
  });
  it('should simply return the whisperText', () => {
    const actual = whisper.whisperText;
    const expected = 'hello';
    expect(actual).toEqual(expected);
  });
  it('should simply return the to', () => {
    const actual = whisper.to;
    const expected = 'Batman';
    expect(actual).toEqual(expected);
  });
  it('should simply return the user', () => {
    const actual = whisper.user;
    const expected = {
      userId: 7,
      username: 'Lucky',
      avatar: 'Lucky'
    };
    expect(actual).toEqual(expected);
  });
});