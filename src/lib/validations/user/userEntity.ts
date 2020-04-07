import { struct } from 'superstruct';

export const validUserEntity = struct(
  {
    email: 'string',
    pass: 'string',
    username: 'string',
    avatar: 'string?',
    confirmationCode: 'string?'
  },
  {
    avatar: 'nobsc-user-default',
    confirmationCode: null
  }
);