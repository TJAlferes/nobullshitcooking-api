import { ChatUser } from '../../../../src/chat/entities/ChatUser';

const user = ChatUser(7, 'Lucky', 'Lucky');

describe('User', () => {
  it('returns the id', () => {
    expect(user.id).toEqual(7);
  });

  it('returns the username', () => {
    expect(user.username).toEqual('Lucky');
  });

  it('returns the avatar', () => {
    expect(user.avatar).toEqual('Lucky');
  });
});