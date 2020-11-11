import { ChatUser } from '../../../../src/chat/entities/ChatUser';

const user = ChatUser('Lucky', 'Lucky');

describe('User', () => {
  it('returns the username', () => {
    expect(user.username).toEqual('Lucky');
  });

  it('returns the avatar', () => {
    expect(user.avatar).toEqual('Lucky');
  });
});