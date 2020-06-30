import { ChatUser } from './ChatUser';

const user = ChatUser(7, 'Lucky', 'Lucky');

describe('User', () => {
  it('returns the userId', () => {
    expect(user.userId).toEqual(7);
  });

  it('returns the username', () => {
    expect(user.username).toEqual('Lucky');
  });

  it('returns the avatar', () => {
    expect(user.avatar).toEqual('Lucky');
  });
});