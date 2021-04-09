import { PrivateMessage } from '../../../../src/chat/entities/PrivateMessage';

const message = PrivateMessage('Batman', 'Lucky', 'hello');

describe('PrivateMessage', () => {
  it('returns a id as current time appended to the username', () => {
    expect(message.id[0]).toEqual('L');
  });

  it('returns the recipient', () => {
    expect(message.to).toEqual('Batman');
  });

  it('returns the sender', () => {
    expect(message.from).toEqual('Lucky');
  });

  it('returns the text', () => {
    expect(message.text).toEqual('hello');
  });
});