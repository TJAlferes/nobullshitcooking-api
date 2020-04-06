import { struct } from 'superstruct';

const validMethodRequest = struct({
  methodId: 'number',
  methodName: 'string?'
});

module.exports = validMethodRequest;