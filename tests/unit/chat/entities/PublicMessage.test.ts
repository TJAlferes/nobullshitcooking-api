import { PublicMessage } from '../../../../src/chat/entities/PublicMessage';

const message = PublicMessage('5067', 'Lucky', 'hello');

describe('PublicMessage', () => {
  it('returns a id as current time appended to the username', () => {
    expect(message.id[0]).toEqual('L');
  });

  it('returns the room', () => {
    expect(message.to).toEqual('5067');
  });

  it('returns the sender', () => {
    expect(message.from).toEqual('Lucky');
  });

  it('returns the text', () => {
    expect(message.text).toEqual('hello');
  });
});