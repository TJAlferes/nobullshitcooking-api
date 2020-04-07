import { struct } from 'superstruct';

export const validStaffEntity = struct(
  {
    email: 'string',
    pass: 'string',
    staffname: 'string',
    avatar: 'string?',
    role: 'string?'
  },
  {
    avatar: 'nobsc-staff-default',
    role: 'staff'
  }
);