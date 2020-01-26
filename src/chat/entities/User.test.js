const User = require('./User');

const user = User(7, 'Lucky', 'Lucky');

describe('User', () => {
  it('should have three parameters', () => {
    const actual = User.length;
    const expected = 3;
    expect(actual).toEqual(expected);
  });
  it('should simply return the userId', () => {
    const actual = user.userId;
    const expected = 7;
    expect(actual).toEqual(expected);
  });
  it('should simply return the username', () => {
    const actual = user.username;
    const expected = 'Lucky';
    expect(actual).toEqual(expected);
  });
  it('should simply return the avatar', () => {
    const actual = user.avatar;
    const expected = 'Lucky';
    expect(actual).toEqual(expected);
  });
});